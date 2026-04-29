import { useAuth } from "@/contexts/AuthContext";
import mealPlanService from "@/services/mealPlanService";
import pantryService from "@/services/pantryService";
import recipeService from "@/services/recipeService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GroceryListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { planId } = useLocalSearchParams();
  const [groceryList, setGroceryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [weekStart, setWeekStart] = useState(
    new Date().toISOString().slice(0, 10),
  );

  useEffect(() => {
    loadGroceryList();
  }, []);

  async function loadGroceryList() {
    if (!user) return;

    setLoading(true);
    try {
      // Get current week's meal plan
      const { data: plan } = await mealPlanService.getWeeklyPlan(
        user.$id,
        weekStart,
      );

      if (!plan) {
        Alert.alert("Info", "No meal plan for this week");
        setLoading(false);
        return;
      }

      // Get user's pantry items
      const { data: pantryItems } = await pantryService.listItems(user.$id);

      // Generate grocery list from meal plan minus pantry
      const { data: groceries } = await mealPlanService.generateGroceryList(
        plan.$id,
        pantryItems || [],
      );

      // Fetch recipe details for each item in the plan
      const enrichedList = [];
      if (plan.slots) {
        for (const slot of plan.slots) {
          const { data: recipe } = await recipeService.getRecipeById(
            slot.recipeId,
          );
          if (recipe && recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
              enrichedList.push({
                id: `${slot.recipeId}-${ingredient}`,
                name: ingredient,
                recipeId: slot.recipeId,
                recipeName: recipe.title,
                qty: slot.servings || 1,
              });
            }
          }
        }
      }

      setGroceryList(enrichedList);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load grocery list");
    }
    setLoading(false);
  }

  function toggleItem(id) {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  }

  async function shareList() {
    if (groceryList.length === 0) {
      Alert.alert("Info", "No items to share");
      return;
    }

    const message = groceryList
      .map((item) => `${checkedItems.has(item.id) ? "✓" : "○"} ${item.name}`)
      .join("\n");

    try {
      await Share.share({
        message: `📋 Grocery List\n\n${message}`,
        title: "Grocery List",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share list");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  const groupedByRecipe = {};
  for (const item of groceryList) {
    if (!groupedByRecipe[item.recipeName]) {
      groupedByRecipe[item.recipeName] = [];
    }
    groupedByRecipe[item.recipeName].push(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📋 Grocery List</Text>
        <View style={styles.spacer} />
      </View>

      {groceryList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items needed</Text>
          <Text style={styles.emptyStateSubtext}>
            You have everything in your pantry!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={Object.entries(groupedByRecipe)}
            keyExtractor={([recipeName]) => recipeName}
            renderItem={({ item: [recipeName, items] }) => (
              <View style={styles.recipeGroup}>
                <Text style={styles.recipeGroupTitle}>{recipeName}</Text>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.groceryItem}
                    onPress={() => toggleItem(item.id)}
                  >
                    <View style={styles.checkbox}>
                      {checkedItems.has(item.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.itemText,
                        checkedItems.has(item.id) && styles.itemTextChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />

          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {checkedItems.size} / {groceryList.length} items
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setCheckedItems(new Set())}
            >
              <Text style={styles.actionBtnText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={shareList}
            >
              <Text style={styles.actionBtnPrimaryText}>📤 Share List</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backBtn: {
    fontSize: 16,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#0a7ea4",
  },
  spacer: {
    width: 60,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  recipeGroup: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
  },
  recipeGroupTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#0a7ea4",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  groceryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#0a7ea4",
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkmark: {
    fontSize: 14,
    color: "#0a7ea4",
    fontWeight: "bold",
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: "#11181C",
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  statsText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionBtnText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
  },
  actionBtnPrimary: {
    backgroundColor: "#0a7ea4",
  },
  actionBtnPrimaryText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
});
