import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const mockRecipes = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy sauce.",
    image: require("@/assets/images/spaghetti.jpg"),
    category: "Dinner",
  },
  {
    id: "2",
    title: "Avocado Toast",
    description: "Healthy breakfast with smashed avocado.",
    image: require("@/assets/images/avocado-toast.jpg"),
    category: "Breakfast",
  },
  {
    id: "3",
    title: "Berry Smoothie Bowl",
    description: "Refreshing and colorful smoothie bowl.",
    image: require("@/assets/images/smoothie-bowl.jpg"),
    category: "Breakfast",
  },
];

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert"];

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍽️ Discover Recipes</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryBtnText,
                selectedCategory === cat && styles.categoryBtnTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recipe/${item.id}`)}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found.</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create-recipe")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 16,
    paddingTop: 34,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#0a7ea4",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    marginBottom: 6,
  },
  categoryBtnActive: {
    backgroundColor: "#0a7ea4",
  },
  categoryBtnText: {
    color: "#0a7ea4",
    fontWeight: "bold",
    fontSize: 14,
  },
  categoryBtnTextActive: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  image: { width: 90, height: 90, borderRadius: 14 },
  cardContent: { flex: 1, padding: 12, justifyContent: "center" },
  title: { fontWeight: "bold", fontSize: 16, color: "#0a7ea4" },
  desc: { color: "#888", marginTop: 4 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#0a7ea4",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
});
