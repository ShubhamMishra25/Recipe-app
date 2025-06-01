import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
} from "react-native";
import { useRouter } from "expo-router";

const mockRecipes = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy sauce.",
    image: require("@/assets/images/spaghetti.jpg"),
  },
  {
    id: "2",
    title: "Avocado Toast",
    description: "Healthy breakfast with smashed avocado.",
    image: require("@/assets/images/avocado-toast.jpg"),
  },
  {
    id: "3",
    title: "Berry Smoothie Bowl",
    description: "Refreshing and colorful smoothie bowl.",
    image: require("@/assets/images/smoothie-bowl.jpg"),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text type="title" style={styles.header}>
        🍽️ Discover Recipes
      </Text>
      <FlatList
        data={mockRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recipe/${item.id}`)}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text type="subtitle">{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create-recipe")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 16 },
  header: { marginBottom: 16, textAlign: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  image: { width: 90, height: 90, borderRadius: 14 },
  cardContent: { flex: 1, padding: 12, justifyContent: "center" },
  desc: { color: "#888", marginTop: 4 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#0a7ea4",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
});
