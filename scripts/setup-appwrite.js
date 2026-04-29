#!/usr/bin/env node
/**
 * One-time Appwrite bootstrap for Meal Planner feature.
 *
 * Creates three collections with attributes and indexes:
 *   - meal_plans
 *   - meal_plan_items
 *   - pantry_items
 *
 * Usage:
 *   npm run setup:appwrite
 *
 * Required env vars (loaded from .env):
 *   - EXPO_PUBLIC_APPWRITE_ENDPOINT
 *   - EXPO_PUBLIC_APPWRITE_PROJECT_ID
 *   - EXPO_PUBLIC_APPWRITE_DB_ID
 *   - APPWRITE_API_KEY
 */

const fs = require("fs");
const path = require("path");
const { Client, Databases, Permission, Role } = require("node-appwrite");

// Load .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.error(`❌ .env file not found at ${envPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (!key) continue;

    let value = valueParts.join("=").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  apiKey: process.env.APPWRITE_API_KEY,
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

const permissions = [
  Permission.create(Role.users()),
  Permission.read(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// Collection schemas
const collections = [
  {
    id: "meal_plans",
    name: "Meal Plans",
    attributes: [
      { key: "ownerAuthId", type: "string", size: 128, required: true },
      { key: "weekStartISO", type: "string", size: 10, required: true },
      { key: "weekEndISO", type: "string", size: 10, required: true },
      { key: "title", type: "string", size: 255, required: true },
      { key: "notes", type: "string", size: 1000, required: false },
    ],
    indexes: [
      { key: "idx_owner", type: "key", attributes: ["ownerAuthId"] },
      {
        key: "idx_unique_plan",
        type: "unique",
        attributes: ["ownerAuthId", "weekStartISO"],
      },
    ],
  },
  {
    id: "meal_plan_items",
    name: "Meal Plan Items",
    attributes: [
      { key: "mealPlanId", type: "string", size: 128, required: true },
      { key: "ownerAuthId", type: "string", size: 128, required: true },
      { key: "dayKey", type: "string", size: 16, required: true },
      { key: "mealType", type: "string", size: 32, required: true },
      { key: "recipeId", type: "string", size: 128, required: true },
      { key: "servings", type: "integer", required: false },
      { key: "notes", type: "string", size: 1000, required: false },
      { key: "sortOrder", type: "integer", required: false },
    ],
    indexes: [
      { key: "idx_plan", type: "key", attributes: ["mealPlanId"] },
      { key: "idx_owner", type: "key", attributes: ["ownerAuthId"] },
      {
        key: "idx_unique_slot",
        type: "unique",
        attributes: ["mealPlanId", "dayKey", "mealType"],
      },
    ],
  },
  {
    id: "pantry_items",
    name: "Pantry Items",
    attributes: [
      { key: "ownerAuthId", type: "string", size: 128, required: true },
      { key: "name", type: "string", size: 255, required: true },
      { key: "normalizedName", type: "string", size: 255, required: true },
      { key: "qty", type: "float", required: true },
      { key: "unit", type: "string", size: 32, required: false },
      { key: "category", type: "string", size: 64, required: false },
      { key: "expiresAt", type: "datetime", required: false },
      { key: "isLowStock", type: "boolean", required: false },
    ],
    indexes: [
      { key: "idx_owner", type: "key", attributes: ["ownerAuthId"] },
      { key: "idx_search", type: "fulltext", attributes: ["name"] },
      {
        key: "idx_unique_item",
        type: "unique",
        attributes: ["ownerAuthId", "normalizedName"],
      },
    ],
  },
];

async function createStringAttribute(collId, attr) {
  console.log(`  Creating attribute: ${attr.key}`);
  await databases.createStringAttribute(
    config.databaseId,
    collId,
    attr.key,
    attr.size,
    attr.required,
  );
}

async function createIntegerAttribute(collId, attr) {
  console.log(`  Creating attribute: ${attr.key}`);
  await databases.createIntegerAttribute(
    config.databaseId,
    collId,
    attr.key,
    attr.required,
  );
}

async function createFloatAttribute(collId, attr) {
  console.log(`  Creating attribute: ${attr.key}`);
  await databases.createFloatAttribute(
    config.databaseId,
    collId,
    attr.key,
    attr.required,
  );
}

async function createBooleanAttribute(collId, attr) {
  console.log(`  Creating attribute: ${attr.key}`);
  await databases.createBooleanAttribute(
    config.databaseId,
    collId,
    attr.key,
    attr.required,
  );
}

async function createDatetimeAttribute(collId, attr) {
  console.log(`  Creating attribute: ${attr.key}`);
  await databases.createDatetimeAttribute(
    config.databaseId,
    collId,
    attr.key,
    attr.required,
  );
}

async function createAttribute(collId, attr) {
  try {
    // Check if attribute already exists
    try {
      await databases.getAttribute(config.databaseId, collId, attr.key);
      console.log(`  ✓ Attribute exists: ${attr.key}`);
      return;
    } catch (e) {
      // Attribute doesn't exist, continue with creation
    }

    switch (attr.type) {
      case "string":
        await createStringAttribute(collId, attr);
        break;
      case "integer":
        await createIntegerAttribute(collId, attr);
        break;
      case "float":
        await createFloatAttribute(collId, attr);
        break;
      case "boolean":
        await createBooleanAttribute(collId, attr);
        break;
      case "datetime":
        await createDatetimeAttribute(collId, attr);
        break;
      default:
        throw new Error(`Unknown attribute type: ${attr.type}`);
    }
    console.log(`  ✓ Created attribute: ${attr.key}`);
  } catch (error) {
    console.error(
      `  ✗ Failed to create attribute ${attr.key}: ${error.message}`,
    );
    throw error;
  }
}

async function createIndex(collId, index) {
  try {
    // Check if index already exists
    try {
      await databases.getIndex(config.databaseId, collId, index.key);
      console.log(`  ✓ Index exists: ${index.key}`);
      return;
    } catch (e) {
      // Index doesn't exist, continue with creation
    }

    console.log(`  Creating index: ${index.key} (${index.type})`);
    await databases.createIndex(
      config.databaseId,
      collId,
      index.key,
      index.type,
      index.attributes,
    );
    console.log(`  ✓ Created index: ${index.key}`);
  } catch (error) {
    console.error(`  ✗ Failed to create index ${index.key}: ${error.message}`);
    throw error;
  }
}

async function setupCollections() {
  console.log(`\n🚀 Starting Appwrite setup...`);
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   Project: ${config.projectId}`);
  console.log(`   Database: ${config.databaseId}\n`);

  for (const collection of collections) {
    try {
      console.log(`📦 Processing collection: ${collection.id}`);

      // Check if collection exists
      let exists = false;
      try {
        await databases.getCollection(config.databaseId, collection.id);
        console.log(`✓ Collection exists: ${collection.id}`);
        exists = true;
      } catch (e) {
        // Collection doesn't exist
      }

      if (!exists) {
        console.log(`Creating collection: ${collection.id}`);
        await databases.createCollection(
          config.databaseId,
          collection.id,
          collection.name,
          permissions,
        );
        console.log(`✓ Created collection: ${collection.id}`);
      }

      // Create attributes
      console.log(`  Adding attributes...`);
      for (const attr of collection.attributes) {
        await createAttribute(collection.id, attr);
      }

      // Create indexes
      console.log(`  Adding indexes...`);
      for (const index of collection.indexes) {
        await createIndex(collection.id, index);
      }

      console.log(`✅ ${collection.id} done!\n`);
    } catch (error) {
      console.error(`\n❌ Error setting up ${collection.id}:`);
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log(`\n✨ Appwrite setup completed successfully!`);
  console.log(`\nYou can now use your Meal Planner services:`);
  console.log(`  - mealPlanService`);
  console.log(`  - pantryService\n`);
}

setupCollections().catch((error) => {
  console.error("\n❌ Setup failed:", error.message);
  process.exit(1);
});
