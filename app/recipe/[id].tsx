import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const mockRecipe = {
  id: "1",
  title: "Spaghetti Carbonara",
  description: "Classic Italian pasta with creamy sauce.",
  image: require("@/assets/images/spaghetti.jpg"),
  ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
  steps: [
    "Boil pasta until al dente.",
    "Fry pancetta until crispy.",
    "Mix eggs and cheese.",
    "Combine all and season.",
  ],
  time: "25 min",
  servings: 2,
  difficulty: "Easy",
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // fetch recipe by id from API or state management
  // For this example, we are using a mock recipe object

  return (
    <ScrollView style={styles.container}>
      <Image source={mockRecipe.image} style={styles.image} />
      <View style={styles.headerRow}>
        <Text>{mockRecipe.title}</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>♡</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{mockRecipe.description}</Text>
      <View style={styles.infoRow}>
        <Text>⏱ {mockRecipe.time}</Text>
        <Text>🍽 {mockRecipe.servings} servings</Text>
        <Text>⭐ {mockRecipe.difficulty}</Text>
      </View>
      <Text style={{ marginTop: 18 }}>Ingredients</Text>
      {mockRecipe.ingredients.map((item, idx) => (
        <Text key={idx}>• {item}</Text>
      ))}
      <Text style={{ marginTop: 18 }}>Steps</Text>
      {mockRecipe.steps.map((step, idx) => (
        <Text key={idx}>
          {idx + 1}. {step}
        </Text>
      ))}
      <TouchableOpacity style={styles.cookBtn}>
        <Text style={styles.cookBtnText}>Start Cooking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push(`/recipe/edit/${mockRecipe.id}`)}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>Edit Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 16 },
  image: { width: "100%", height: 220, borderRadius: 16, marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  saveBtnText: { fontSize: 22, color: "#FF6B6B" },
  desc: { color: "#888", marginVertical: 8 },
  infoRow: { flexDirection: "row", gap: 16, marginVertical: 8 },
  cookBtn: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
    marginBottom: 24,
  },
  cookBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  editBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
