import { useAuth } from "@/contexts/AuthContext";
import mealPlanService from "@/services/mealPlanService";
import recipeService from "@/services/recipeService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

export default function MealPlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(getMonday());
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  function getMonday() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().slice(0, 10);
  }

  useEffect(() => {
    loadPlan();
  }, [weekStart]);

  async function loadPlan() {
    if (!user) return;

    setLoading(true);
    try {
      const { data: existingPlan } = await mealPlanService.getWeeklyPlan(
        user.$id,
        weekStart,
      );
      setPlan(existingPlan);

      if (!existingPlan) {
        const { data: newPlan } = await mealPlanService.createPlan({
          ownerAuthId: user.$id,
          weekStartISO: weekStart,
          title: `Week of ${weekStart}`,
        });
        setPlan(newPlan);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load meal plan");
    }

    const { data } = await recipeService.listRecipes();
    setRecipes(data || []);

    setLoading(false);
  }

  async function addRecipeToPlan() {
    if (!selectedSlot || !selectedRecipe || !plan) return;

    try {
      await mealPlanService.addSlot({
        mealPlanId: plan.$id,
        ownerAuthId: user.$id,
        dayKey: selectedSlot.dayKey,
        mealType: selectedSlot.mealType,
        recipeId: selectedRecipe.$id,
        servings: 1,
      });

      await loadPlan();
      setModalVisible(false);
      setSelectedSlot(null);
      setSelectedRecipe(null);
    } catch (error) {
      Alert.alert("Error", "Failed to add recipe to plan");
    }
  }

  async function removeSlot(slotId) {
    try {
      await mealPlanService.removeSlot(slotId);
      await loadPlan();
    } catch (error) {
      Alert.alert("Error", "Failed to remove recipe");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load meal plan</Text>
      </View>
    );
  }

  const slotsByDayAndMeal = {};
  for (const slot of plan.slots || []) {
    const key = `${slot.dayKey}-${slot.mealType}`;
    slotsByDayAndMeal[key] = slot;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Weekly Meal Planner</Text>
        <Text style={styles.weekLabel}>Week of {weekStart}</Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            const prev = new Date(weekStart);
            prev.setDate(prev.getDate() - 7);
            setWeekStart(prev.toISOString().slice(0, 10));
          }}
        >
          <Text style={styles.navBtnText}>← Prev Week</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnToday]}
          onPress={() => setWeekStart(getMonday())}
        >
          <Text style={styles.navBtnText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            const next = new Date(weekStart);
            next.setDate(next.getDate() + 7);
            setWeekStart(next.toISOString().slice(0, 10));
          }}
        >
          <Text style={styles.navBtnText}>Next Week →</Text>
        </TouchableOpacity>
      </View>

      {DAYS.map((day, dayIdx) => (
        <View key={day} style={styles.dayCard}>
          <Text style={styles.dayLabel}>{day}</Text>

          {MEAL_TYPES.map((mealType) => {
            const key = `${day.toLowerCase().slice(0, 3)}-${mealType}`;
            const slot = slotsByDayAndMeal[key];
            const recipe = recipes.find((r) => r.$id === slot?.recipeId);

            return (
              <TouchableOpacity
                key={mealType}
                style={styles.mealSlot}
                onPress={() => {
                  setSelectedSlot({
                    dayKey: key.split("-")[0],
                    mealType,
                  });
                  setModalVisible(true);
                }}
              >
                <Text style={styles.mealTypeLabel}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
                {slot && recipe ? (
                  <View style={styles.recipeInSlot}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    {slot && (
                      <TouchableOpacity
                        onPress={() => removeSlot(slot.$id)}
                        style={styles.removeBtn}
                      >
                        <Text style={styles.removeBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <Text style={styles.emptySlot}>+ Add recipe</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <TouchableOpacity
        style={styles.groceryBtn}
        onPress={() => router.push("/grocery-list")}
      >
        <Text style={styles.groceryBtnText}>📋 View Grocery List</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedSlot(null);
          setSelectedRecipe(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Recipe</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedSlot(null);
                  setSelectedRecipe(null);
                }}
              >
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recipes}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.recipeOption,
                    selectedRecipe?.$id === item.$id &&
                      styles.recipeOptionSelected,
                  ]}
                  onPress={() => setSelectedRecipe(item)}
                >
                  <Text style={styles.recipeOptionText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[styles.addBtn, !selectedRecipe && styles.addBtnDisabled]}
              onPress={addRecipeToPlan}
              disabled={!selectedRecipe}
            >
              <Text style={styles.addBtnText}>Add to Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#0a7ea4",
    marginBottom: 4,
  },
  weekLabel: {
    fontSize: 14,
    color: "#666",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  navBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
  },
  navBtnToday: {
    backgroundColor: "#0a7ea4",
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0a7ea4",
  },
  navBtnToday: {
    backgroundColor: "#0a7ea4",
  },
  dayCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  dayLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0a7ea4",
    marginBottom: 12,
  },
  mealSlot: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0a7ea4",
  },
  mealTypeLabel: {
    fontWeight: "600",
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  recipeInSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  removeBtn: {
    padding: 6,
    marginLeft: 8,
  },
  removeBtnText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  emptySlot: {
    fontSize: 13,
    color: "#aaa",
    fontStyle: "italic",
  },
  groceryBtn: {
    marginHorizontal: 16,
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  groceryBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  closeBtn: {
    fontSize: 24,
    color: "#666",
  },
  recipeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  recipeOptionSelected: {
    backgroundColor: "#e6f3ff",
  },
  recipeOptionText: {
    fontSize: 14,
    color: "#11181C",
  },
  addBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnDisabled: {
    backgroundColor: "#ccc",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
});
