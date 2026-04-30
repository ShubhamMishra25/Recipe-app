import { Account, Client, Databases, Storage } from "react-native-appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  db: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  col: {
    users: process.env.EXPO_PUBLIC_APPWRITE_COL_USERS_ID,
    recipes: process.env.EXPO_PUBLIC_APPWRITE_COL_RECIPES_ID,
    comments: process.env.EXPO_PUBLIC_APPWRITE_COL_COMMENTS_ID,
    savedRecipes: process.env.EXPO_PUBLIC_APPWRITE_COL_SAVED_RECIPES_ID,
    mealPlans: process.env.EXPO_PUBLIC_APPWRITE_COL_MEAL_PLANS_ID,
    mealPlanItems: process.env.EXPO_PUBLIC_APPWRITE_COL_MEAL_PLAN_ITEMS_ID,
    pantryItems: process.env.EXPO_PUBLIC_APPWRITE_COL_PANTRY_ITEMS_ID,
  },
  bucket: {
    avatars: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_AVATARS_ID,
    recipeMedia: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_RECIPE_MEDIA_ID,
  },
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME);

const databases = new Databases(client);

const storage = new Storage(client);

const account = new Account(client);

export { account, client, config, databases, storage };
