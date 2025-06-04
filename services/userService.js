import databaseService from "./databaseService";
import { ID, Query } from "react-native-appwrite";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_USERS_ID;

const userService = {
  // Create a new user profile document
  async createUserProfile(data) {
    return await databaseService.createDocument(dbId, colId, data, ID.unique());
  },

  // Get user profile by Appwrite Auth user ID
  async getUserByAuthId(authUserId) {
    const { data, error } = await databaseService.listDocuments(dbId, colId, [
      Query.equal("authUserId", authUserId),
    ]);
    if (error) return { error };
    return data.length > 0 ? data[0] : null;
  },

  // Update user profile by Appwrite Auth user ID
  async updateUserProfile(userDocId, data) {
    return await databaseService.updateDocument(dbId, colId, userDocId, data);
  },
};

export default userService;
