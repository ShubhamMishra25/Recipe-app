import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

// Mock existing recipe data
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
};

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Pre-fill with existing recipe data
  const [title, setTitle] = useState(mockRecipe.title);
  const [desc, setDesc] = useState(mockRecipe.description);
  const [ingredients, setIngredients] = useState<string[]>(mockRecipe.ingredients);
  const [steps, setSteps] = useState<string[]>(mockRecipe.steps);
  const [image, setImage] = useState<string | null>(null);

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

  const handleSave = () => {
    // TODO: Save edited recipe (Appwrite integration)
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF5E6" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          ✏️ Edit Recipe
        </Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.recipeImage} />
          ) : (
            <Image source={mockRecipe.image} style={styles.recipeImage} />
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