import { ID, Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

const dbId = config.db;
const pantryItemsColId = config.col.pantryItems;

const normalizeText = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const pantryService = {
  async listItems(ownerAuthId) {
    try {
      const response = await databases.listDocuments(dbId, pantryItemsColId, [
        Query.equal("ownerAuthId", ownerAuthId),
      ]);

      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async getItemByName(ownerAuthId, name) {
    try {
      const response = await databases.listDocuments(dbId, pantryItemsColId, [
        Query.equal("ownerAuthId", ownerAuthId),
        Query.equal("normalizedName", normalizeText(name)),
      ]);

      return { data: response.documents?.[0] || null, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async upsertItem({
    ownerAuthId,
    name,
    qty = 1,
    unit = "",
    category = "",
    expiresAt = null,
    isLowStock = false,
  }) {
    try {
      const normalizedName = normalizeText(name);
      const existing = await this.getItemByName(ownerAuthId, name);

      if (existing.error) return { error: existing.error };

      const payload = {
        ownerAuthId,
        name: name.trim(),
        normalizedName,
        qty,
        unit,
        category,
        expiresAt,
        isLowStock,
      };

      if (existing.data) {
        const response = await databases.updateDocument(
          dbId,
          pantryItemsColId,
          existing.data.$id,
          payload,
        );
        return { data: response, error: null };
      }

      const response = await databases.createDocument(
        dbId,
        pantryItemsColId,
        ID.unique(),
        payload,
      );

      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async updateItem(itemId, data) {
    try {
      const payload = { ...data };
      if (payload.name) {
        payload.normalizedName = normalizeText(payload.name);
        payload.name = payload.name.trim();
      }

      const response = await databases.updateDocument(
        dbId,
        pantryItemsColId,
        itemId,
        payload,
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async deleteItem(itemId) {
    try {
      await databases.deleteDocument(dbId, pantryItemsColId, itemId);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  async searchItems(ownerAuthId, queryText) {
    try {
      const response = await databases.listDocuments(dbId, pantryItemsColId, [
        Query.equal("ownerAuthId", ownerAuthId),
        Query.search("name", queryText),
      ]);

      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};

export default pantryService;
