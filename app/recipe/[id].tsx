import recipeService from "@/services/recipeService";
import mealPlanService from "@/services/mealPlanService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState("mon");
  const [selectedMeal, setSelectedMeal] = useState("lunch");

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

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    if (!user) return;
    try {
      const { data } = await mealPlanService.listPlans(user.$id);
      setMealPlans(data || []);
      if (data && data.length > 0) {
        setSelectedPlan(data[0].$id);
      }
    } catch (error) {
      console.error("Failed to load meal plans");
    }
  };

  const handleAddToPlan = async () => {
    if (!user || !recipe || !selectedPlan) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    try {
      await mealPlanService.addSlot({
        mealPlanId: selectedPlan,
        ownerAuthId: user.$id,
        dayKey: selectedDay,
        mealType: selectedMeal,
        recipeId: recipe.$id,
        servings: recipe.servings || 1,
      });
      Alert.alert("Success", "Recipe added to meal plan!");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add recipe to meal plan");
    }
  };

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
      ],
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
        style={[styles.cookBtn, { backgroundColor: "#0ac500" }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.cookBtnText}>📅 Add to Meal Plan</Text>
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
        <View style={{ paddingBottom: 24 }}>
          {comments.length === 0 ? (
            <Text style={styles.emptyCommentsText}>
              No feedback yet. Be the first to comment.
            </Text>
          ) : (
            comments.map((item) => (
              <View key={item.id} style={styles.commentCard}>
                <Text style={styles.commentUser}>
                  {item.user}{" "}
                  <Text style={styles.commentStars}>
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </Text>
                </Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>

    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Meal Plan</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {mealPlans.length === 0 ? (
            <View style={styles.noPlanText}>
              <Text style={styles.noPlanMessage}>
                No meal plans yet. Create one first!
              </Text>
              <TouchableOpacity
                style={styles.createPlanBtn}
                onPress={() => {
                  router.push("/meal-planner");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.createPlanBtnText}>Go to Meal Planner</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Select Meal Plan</Text>
                <View style={styles.pickerContainer}>
                  {mealPlans.map((plan) => (
                    <TouchableOpacity
                      key={plan.$id}
                      style={[
                        styles.pickerOption,
                        selectedPlan === plan.$id && styles.pickerOptionSelected,
                      ]}
                      onPress={() => setSelectedPlan(plan.$id)}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          selectedPlan === plan.$id &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {plan.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Day</Text>
                  <View style={styles.pickerContainer}>
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                      (day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.pickerOption,
                            selectedDay === day && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedDay(day)}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedDay === day &&
                                styles.pickerOptionTextSelected,
                            ]}
                          >
                            {day.slice(0, 3).toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Meal Type</Text>
                  <View style={styles.pickerContainer}>
                    {["breakfast", "lunch", "dinner"].map((meal) => (
                      <TouchableOpacity
                        key={meal}
                        style={[
                          styles.pickerOption,
                          selectedMeal === meal &&
                            styles.pickerOptionSelected,
                        ]}
                        onPress={() => setSelectedMeal(meal)}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            selectedMeal === meal &&
                              styles.pickerOptionTextSelected,
                          ]}
                        >
                          {meal.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAddToPlan}
                >
                  <Text style={styles.addBtnText}>Add to Plan</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
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
  emptyCommentsText: {
    color: "#666",
    fontStyle: "italic",
  },
  commentUser: { fontWeight: "bold", color: "#0a7ea4" },
  commentStars: { color: "#FFB300", fontSize: 14 },
  commentText: { color: "#333", marginTop: 2 },
  // Modal styles
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  noPlanText: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noPlanMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  createPlanBtn: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createPlanBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerOptionSelected: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  pickerOptionText: {
    fontSize: 12,
    color: "#666",
  },
  pickerOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    fontWeight: "600",
    color: "#666",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: {
    fontWeight: "600",
    color: "#fff",
  },
});
