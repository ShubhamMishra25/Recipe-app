import databaseService from './databaseService';

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_RECIPES_ID;

const recipeService = {
  // Create a new recipe
  async createRecipe(data, id = null) {
    return await databaseService.createDocument(dbId, colId, data, id);
  },

  // Get a recipe by document ID
  async getRecipeById(recipeId) {
    const { data, error } = await databaseService.listDocuments(
      dbId,
      colId,
      [`query=$id="${recipeId}"`]
    );
    if (error) return { error };
    return data.length > 0 ? data[0] : null;
  },

  // List recipes with optional queries (e.g., search, filter, pagination)
  async listRecipes(queries = []) {
    return await databaseService.listDocuments(dbId, colId, queries);
  },

  // Update a recipe
  async updateRecipe(recipeId, data) {
    return await databaseService.updateDocument(dbId, colId, recipeId, data);
  },

  // Delete a recipe
  async deleteRecipe(recipeId) {
    return await databaseService.deleteDocument(dbId, colId, recipeId);
  },
};

export default recipeService;