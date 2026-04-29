import { useAuth } from "@/contexts/AuthContext";
import pantryService from "@/services/pantryService";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PantryScreen() {
  const { user } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemUnit, setItemUnit] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPantry();
  }, []);

  async function loadPantry() {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await pantryService.listItems(user.$id);
      setPantryItems(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load pantry");
    }
    setLoading(false);
  }

  async function savePantryItem() {
    if (!itemName.trim()) {
      Alert.alert("Error", "Item name is required");
      return;
    }

    try {
      if (editingId) {
        await pantryService.updateItem(editingId, {
          name: itemName,
          qty: parseFloat(itemQty) || 1,
          unit: itemUnit,
          category: itemCategory,
        });
      } else {
        await pantryService.upsertItem({
          ownerAuthId: user.$id,
          name: itemName,
          qty: parseFloat(itemQty) || 1,
          unit: itemUnit,
          category: itemCategory,
        });
      }

      await loadPantry();
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
    }
  }

  async function deleteItem(id) {
    Alert.alert("Delete Item", "Remove this item from pantry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await pantryService.deleteItem(id);
            await loadPantry();
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  }

  function openModal(item = null) {
    if (item) {
      setEditingId(item.$id);
      setItemName(item.name);
      setItemQty(item.qty?.toString() || "1");
      setItemUnit(item.unit || "");
      setItemCategory(item.category || "");
    } else {
      setEditingId(null);
      setItemName("");
      setItemQty("1");
      setItemUnit("");
      setItemCategory("");
    }
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingId(null);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗄️ My Pantry</Text>
        <Text style={styles.subtitle}>{pantryItems.length} items</Text>
      </View>

      <FlatList
        data={pantryItems}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => openModal(item)}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemDetails}>
                  {item.category && (
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  )}
                  <Text style={styles.itemQty}>
                    {item.qty} {item.unit || "qty"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteItem(item.$id)}
            >
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Your pantry is empty</Text>
            <Text style={styles.emptyStateSubtext}>
              Add items to track what you have
            </Text>
          </View>
        }
        contentContainerStyle={pantryItems.length === 0 && { flexGrow: 1 }}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addBtnText}>+ Add Item</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Item" : "Add to Pantry"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Olive Oil"
                value={itemName}
                onChangeText={setItemName}
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  value={itemQty}
                  onChangeText={setItemQty}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#aaa"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., ml, g"
                  value={itemUnit}
                  onChangeText={setItemUnit}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Oils, Spices"
                value={itemCategory}
                onChangeText={setItemCategory}
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={savePantryItem}>
                <Text style={styles.saveBtnText}>
                  {editingId ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#0a7ea4",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
  },
  itemCard: {
    marginHorizontal: 16,
    marginBottomVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    paddingRight: 12,
  },
  itemContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemInfo: {
    gap: 4,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#11181C",
  },
  itemDetails: {
    flexDirection: "row",
    gap: 8,
  },
  itemCategory: {
    fontSize: 12,
    color: "#0a7ea4",
    backgroundColor: "#e6f3ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemQty: {
    fontSize: 12,
    color: "#666",
  },
  deleteBtn: {
    padding: 8,
  },
  deleteBtnText: {
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  addBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  closeBtn: {
    fontSize: 24,
    color: "#666",
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#11181C",
    backgroundColor: "#fafafa",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
});
