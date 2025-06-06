import {Client, Databases, Account, Storage } from 'react-native-appwrite';

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  db: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  col: {
    users: process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID,
    recipes: process.env.EXPO_PUBLIC_APPWRITE_COL_RECIPES_ID,
    comments: process.env.EXPO_PUBLIC_APPWRITE_COL_COMMENTS_ID,
    savedRecipes: process.env.EXPO_PUBLIC_APPWRITE_COL_SAVED_RECIPES_ID,
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

export { databases, account, config, client, storage };
