import { ID, Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

const dbId = config.db;
const colId = config.col.savedRecipes;

const savedRecipeService = {
  async getSavedRecipes(userId) {
    try {
      const response = await databases.listDocuments(dbId, colId, [
        Query.equal("userId", userId),
      ]);
      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async isRecipeSaved(userId, recipeId) {
    try {
      const response = await databases.listDocuments(dbId, colId, [
        Query.equal("userId", userId),
        Query.equal("recipeId", recipeId),
      ]);
      return {
        isSaved: response.documents.length > 0,
        docId: response.documents.length > 0 ? response.documents[0].$id : null,
        error: null,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  async saveRecipe(userId, recipeId) {
    try {
      const response = await databases.createDocument(
        dbId,
        colId,
        ID.unique(),
        {
          userId,
          recipeId,
          savedAt: new Date().toISOString(),
        },
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async removeSavedRecipe(docId) {
    try {
      await databases.deleteDocument(dbId, colId, docId);
      return { success: true, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};

export default savedRecipeService;
