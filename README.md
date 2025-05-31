# Recipe App 👨‍🍳

A mobile application built with [Expo](https://expo.dev) that allows users to discover, save, and create recipes.

## About

Recipe App is a simple yet powerful platform for food enthusiasts to:

- Browse and discover new recipes
- Create and share their own recipes
- Save favorites for easy access later
- Rate and provide feedback on recipes

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## App Structure

### Core Pages

#### 1. Authentication

- Login/Signup with email/password or social login options
- User Profile with basic information, profile picture, and dietary preferences

#### 2. Home/Discovery

- Clean feed of recipes with filters
- Search functionality
- Categories (breakfast, lunch, dinner, desserts, etc.)
- Recently viewed recipes

#### 3. Recipe Creation

- Single-page form with:
  - Recipe name and description
  - Ingredients list (add/remove items)
  - Step-by-step instructions
  - Photo upload
  - Basic details (cooking time, servings, difficulty)

#### 4. Recipe Detail

- Recipe image display
- Ingredients list
- Preparation steps
- Basic information (time, servings)
- Save/favorite button
- Star rating system

#### 5. Saved Recipes

- List of saved recipes
- Basic sorting/filtering options

### User Journey

1. User signs up/logs in
2. Browses or searches for recipes
3. Views recipe details
4. Saves favorite recipes
5. Creates and shares own recipes

### Appwrite Integration

The app uses Appwrite for:

- Authentication: User accounts and sessions
- Database: Recipe storage, user profiles, saved recipes
- Storage: Recipe images
- Realtime: Live feed updates
