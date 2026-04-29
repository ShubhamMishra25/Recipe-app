import { ID, Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

const dbId = config.db;
const mealPlansColId = config.col.mealPlans;
const mealPlanItemsColId = config.col.mealPlanItems;
const pantryItemsColId = config.col.pantryItems;

const normalizeText = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const defaultWeekEnd = (weekStartISO) => {
  const start = new Date(weekStartISO);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end.toISOString().slice(0, 10);
};

const mealPlanService = {
  async getWeeklyPlan(ownerAuthId, weekStartISO) {
    try {
      const { data, error } = await this.listPlans(ownerAuthId, weekStartISO);
      if (error) return { error };

      const plan = data[0] || null;
      if (!plan) return { data: null, error: null };

      const slotsResult = await this.listPlanItems(plan.$id);
      if (slotsResult.error) return { error: slotsResult.error };

      return {
        data: {
          ...plan,
          slots: slotsResult.data,
        },
        error: null,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  async listPlans(ownerAuthId, weekStartISO = null) {
    try {
      const queries = [Query.equal("ownerAuthId", ownerAuthId)];
      if (weekStartISO) {
        queries.push(Query.equal("weekStartISO", weekStartISO));
      }

      const response = await databases.listDocuments(
        dbId,
        mealPlansColId,
        queries,
      );
      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async createPlan({
    ownerAuthId,
    weekStartISO,
    title = "Weekly Meal Plan",
    notes = "",
  }) {
    try {
      const payload = {
        ownerAuthId,
        weekStartISO,
        weekEndISO: defaultWeekEnd(weekStartISO),
        title,
        notes,
      };

      const response = await databases.createDocument(
        dbId,
        mealPlansColId,
        ID.unique(),
        payload,
      );

      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async updatePlan(planId, data) {
    try {
      const response = await databases.updateDocument(
        dbId,
        mealPlansColId,
        planId,
        data,
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async deletePlan(planId) {
    try {
      const planItems = await this.listPlanItems(planId);
      if (!planItems.error) {
        await Promise.all(
          planItems.data.map((slot) =>
            databases.deleteDocument(dbId, mealPlanItemsColId, slot.$id),
          ),
        );
      }

      await databases.deleteDocument(dbId, mealPlansColId, planId);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  async listPlanItems(mealPlanId) {
    try {
      const response = await databases.listDocuments(dbId, mealPlanItemsColId, [
        Query.equal("mealPlanId", mealPlanId),
      ]);
      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async addSlot({
    mealPlanId,
    ownerAuthId,
    dayKey,
    mealType,
    recipeId,
    servings = 1,
    notes = "",
    sortOrder = 0,
  }) {
    try {
      const response = await databases.createDocument(
        dbId,
        mealPlanItemsColId,
        ID.unique(),
        {
          mealPlanId,
          ownerAuthId,
          dayKey,
          mealType,
          recipeId,
          servings,
          notes,
          sortOrder,
        },
      );

      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async updateSlot(slotId, data) {
    try {
      const response = await databases.updateDocument(
        dbId,
        mealPlanItemsColId,
        slotId,
        data,
      );
      return { data: response, error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async removeSlot(slotId) {
    try {
      await databases.deleteDocument(dbId, mealPlanItemsColId, slotId);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  async getPantryItems(ownerAuthId) {
    try {
      const response = await databases.listDocuments(dbId, pantryItemsColId, [
        Query.equal("ownerAuthId", ownerAuthId),
      ]);

      return { data: response.documents || [], error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async generateGroceryList(mealPlanId, pantryItems = []) {
    const { data: slots, error } = await this.listPlanItems(mealPlanId);
    if (error) return { error };

    const pantryLookup = new Map(
      pantryItems.map((item) => [normalizeText(item.name), item]),
    );

    const groceryMap = new Map();

    for (const slot of slots) {
      const slotName = normalizeText(
        slot.recipeTitle || slot.recipeName || slot.recipeId,
      );
      if (!slotName) continue;

      if (!groceryMap.has(slotName)) {
        groceryMap.set(slotName, {
          name: slot.recipeTitle || slot.recipeName || slot.recipeId,
          qty: slot.servings || 1,
          unit: slot.unit || "",
          recipeIds: [slot.recipeId],
          inPantry: pantryLookup.has(slotName),
        });
      } else {
        const current = groceryMap.get(slotName);
        current.qty += slot.servings || 1;
        current.recipeIds.push(slot.recipeId);
      }
    }

    return {
      data: Array.from(groceryMap.values()).filter((item) => !item.inPantry),
      error: null,
    };
  },
};

export default mealPlanService;
