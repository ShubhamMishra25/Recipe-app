import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import recipeService from "@/services/recipeService";
import { useLocalSearchParams, useRouter } from "expo-router";

const difficulties = ["Easy", "Medium", "Hard"];
const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [image, setImage] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [category, setCategory] = useState(categories[0]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const res = await recipeService.getRecipeById(id);
      if (res.data) {
        setRecipe(res.data);
        setTitle(res.data.title || "");
        setDesc(res.data.description || "");
        setIngredients(res.data.ingredients || [""]);
        setSteps(res.data.steps || [""]);
        setCookingTime(
          res.data.cookingTime !== undefined ? String(res.data.cookingTime) : ""
        );
        setServings(
          res.data.servings !== undefined ? String(res.data.servings) : ""
        );
        setDifficulty(res.data.difficulty || difficulties[0]);
        setCategory(res.data.category || categories[0]);
        setImage(null); // Only set if user picks a new image
      }
      setLoading(false);
    };
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const addStep = () => setSteps([...steps, ""]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    let imageFile = null;
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      imageFile = new File([blob], "recipe.jpg", { type: blob.type });
    }
    const data = {
      title,
      description: desc,
      ingredients,
      steps,
      cookingTime: parseInt(cookingTime, 10),
      servings: parseInt(servings, 10),
      difficulty,
      category,
      updatedAt: new Date().toISOString(),
      imageId: recipe.imageId,
    };
    const result = await recipeService.updateRecipe(
      recipe.$id,
      data,
      imageFile
    );
    if (!result.error) {
      router.back();
    } else {
      alert("Failed to update recipe: " + result.error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFF5E6",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0a7ea4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF5E6" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          ✏️ Edit Recipe
        </Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.recipeImage} />
          ) : recipe?.imageId ? (
            <Image
              source={{ uri: recipeService.getRecipeImageUrl(recipe.imageId) }}
              style={styles.recipeImage}
            />
          ) : (
            <Text style={styles.imagePickerText}>+ Add Photo</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Short Description"
          value={desc}
          onChangeText={setDesc}
          multiline
        />
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Ingredient ${index + 1}`}
            value={ingredient}
            onChangeText={(text) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = text;
              setIngredients(newIngredients);
            }}
          />
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
          <Text style={styles.addBtnText}>+ Add Ingredient</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Steps</Text>
        {steps.map((step, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Step ${index + 1}`}
            value={step}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[index] = text;
              setSteps(newSteps);
            }}
          />
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addStep}>
          <Text style={styles.addBtnText}>+ Add Step</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Cooking Time (minutes)"
          value={cookingTime}
          onChangeText={setCookingTime}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Servings"
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
        />
        <Text style={styles.sectionTitle}>Difficulty</Text>
        {difficulties.map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.addBtn,
              difficulty === d && { backgroundColor: "#FF6B6B" },
            ]}
            onPress={() => setDifficulty(d)}
          >
            <Text
              style={[styles.addBtnText, difficulty === d && { color: "#fff" }]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Category</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.addBtn,
              category === cat && { backgroundColor: "#FF6B6B" },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[styles.addBtnText, category === cat && { color: "#fff" }]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 16,
    paddingTop: 34,
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  imagePickerText: {
    color: "#0a7ea4",
    fontWeight: "bold",
    fontSize: 18,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: "#0a7ea4",
  },
  addBtn: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  saveBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});