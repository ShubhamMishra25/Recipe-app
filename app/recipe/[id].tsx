import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import recipeService from "@/services/recipeService";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ratings & feedback state
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const { data, error } = await recipeService.getRecipeById(id);
      if (data) setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
    // Optionally, fetch comments from Appwrite here when implementing comments collection
    setComments([]); // Clear or fetch comments
  }, [id]);

  const handleAddComment = () => {
    if (userComment.trim() && userRating > 0) {
      setComments([
        ...comments,
        {
          id: Math.random().toString(),
          user: "You",
          text: userComment,
          rating: userRating,
        },
      ]);
      setUserComment("");
      setUserRating(0);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await recipeService.deleteRecipe(recipe.$id);
            if (!result.error) {
              Alert.alert("Deleted", "Recipe deleted successfully.");
              router.replace("/home");
            } else {
              Alert.alert("Error", result.error || "Failed to delete recipe.");
            }
          },
        },
      ]
    );
  };

  if (loading || !recipe) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          recipe.imageId
            ? { uri: recipeService.getRecipeImageUrl(recipe.imageId) }
            : require("@/assets/images/spaghetti.jpg")
        }
        style={styles.image}
      />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{recipe.title}</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>♡</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{recipe.description}</Text>
      <View style={styles.infoRow}>
        <Text>⏱ {recipe.time}</Text>
        <Text>🍽 {recipe.servings} servings</Text>
        <Text>⭐ {recipe.difficulty}</Text>
      </View>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((item, idx) => (
        <Text key={idx}>• {item}</Text>
      ))}
      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps.map((step, idx) => (
        <Text key={idx}>
          {idx + 1}. {step}
        </Text>
      ))}
      <TouchableOpacity style={styles.cookBtn}>
        <Text style={styles.cookBtnText}>Start Cooking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push(`/recipe/edit/${recipe.$id}`)}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>Edit Recipe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cookBtn}
        onPress={() => router.push(`/recipe/cooking-mode/${recipe.$id}`)}
      >
        <Text style={styles.cookBtnText}>Cooking Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.editBtn, { backgroundColor: "#888" }]}
        onPress={handleDelete}
      >
        <Text style={styles.editBtnText}>Delete Recipe</Text>
      </TouchableOpacity>

      {/* Ratings & Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>Rate & Comment</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setUserRating(star)}
              style={styles.starBtn}
            >
              <Text
                style={[styles.star, userRating >= star && styles.starActive]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Leave a comment..."
          value={userComment}
          onChangeText={setUserComment}
          multiline
        />
        <TouchableOpacity
          style={styles.addCommentBtn}
          onPress={handleAddComment}
        >
          <Text style={styles.addCommentBtnText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <Text style={styles.commentUser}>
                {item.user}{" "}
                <Text style={styles.commentStars}>
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </Text>
              </Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
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
  title: { fontWeight: "bold", fontSize: 22, color: "#0a7ea4" },
  saveBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  saveBtnText: { fontSize: 22, color: "#FF6B6B" },
  desc: { color: "#888", marginVertical: 8 },
  infoRow: { flexDirection: "row", gap: 16, marginVertical: 8 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 8,
    color: "#0a7ea4",
  },
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
    marginBottom: 24,
  },
  editBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  feedbackSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    elevation: 1,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 4,
  },
  starBtn: { padding: 4 },
  star: { fontSize: 28, color: "#ccc" },
  starActive: { color: "#FFB300" },
  commentInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    minHeight: 40,
  },
  addCommentBtn: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  addCommentBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  commentCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentUser: { fontWeight: "bold", color: "#0a7ea4" },
  commentStars: { color: "#FFB300", fontSize: 14 },
  commentText: { color: "#333", marginTop: 2 },
});
