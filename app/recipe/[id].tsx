import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
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

const mockComments = [
  { id: "c1", user: "Alice", text: "Delicious! My family loved it.", rating: 5 },
  { id: "c2", user: "Bob", text: "Easy to follow and tasty.", rating: 4 },
];

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Ratings & feedback state
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState(mockComments);

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

  return (
    <ScrollView style={styles.container}>
      <Image source={mockRecipe.image} style={styles.image} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{mockRecipe.title}</Text>
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
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {mockRecipe.ingredients.map((item, idx) => (
        <Text key={idx}>• {item}</Text>
      ))}
      <Text style={styles.sectionTitle}>Steps</Text>
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
              <Text style={[styles.star, userRating >= star && styles.starActive]}>
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
        <TouchableOpacity style={styles.addCommentBtn} onPress={handleAddComment}>
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