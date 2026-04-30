import { ID } from "react-native-appwrite";
import { config, databases, storage } from "./appwrite";

const dbId = config.db;
const colId = config.col.recipes;
const bucketId = config.bucket.recipeMedia;

const recipeService = {
  // List all recipes
  async listRecipes(queries = []) {
    try {
      const response = await databases.listDocuments(dbId, colId, queries);
      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get a single recipe by document ID
  async getRecipeById(recipeId) {
    try {
      const response = await databases.getDocument(dbId, colId, recipeId);
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Create a new recipe
  async createRecipe(data, imageFile) {
    try {
      let imageId = null;
      if (imageFile) {
        try {
          const fileToUpload = {
            uri: imageFile.uri,
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
          };

          const fileRes = await storage.createFile(
            bucketId,
            ID.unique(),
            fileToUpload,
          );
          imageId = fileRes.$id;
        } catch (uploadError) {
          console.error(
            "Image upload failed, continuing without image:",
            uploadError,
          );
        }
      }
      const docData = { ...data, imageId };
      const response = await databases.createDocument(
        dbId,
        colId,
        ID.unique(),
        docData,
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update a recipe
  async updateRecipe(recipeId, data, imageFile) {
    try {
      let imageId = data.imageId;
      if (imageFile) {
        try {
          const fileToUpload = {
            uri: imageFile.uri,
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
          };

          const fileRes = await storage.createFile(
            bucketId,
            ID.unique(),
            fileToUpload,
          );
          if (fileRes && fileRes.$id) {
            imageId = fileRes.$id;
          } else {
            console.warn(
              "File uploaded but no $id in response, keeping old imageId",
            );
          }
        } catch (uploadError) {
          console.error(
            "Image upload error (continuing without image):",
            uploadError,
          );
        }
      }
      const docData = { ...data, imageId };
      const response = await databases.updateDocument(
        dbId,
        colId,
        recipeId,
        docData,
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Delete a recipe
  async deleteRecipe(recipeId) {
    try {
      await databases.deleteDocument(dbId, colId, recipeId);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get recipe image URL
  getRecipeImageUrl(imageId) {
    if (!imageId) return null;
    return storage.getFilePreview(bucketId, imageId).href;
  },
};

export default recipeService;