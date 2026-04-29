import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const savedRecipes = [
  {
    id: "1",
    title: "Berry Smoothie Bowl",
    image: require("@/assets/images/smoothie-bowl.jpg"),
  },
  {
    id: "2",
    title: "Avocado Toast",
    image: require("@/assets/images/avocado-toast.jpg"),
  },
];

export default function SavedRecipes() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>💾 Saved Recipes</Text>
        <FlatList
          data={savedRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/recipe/${item.id}`)}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        {savedRecipes.length === 0 && (
          <Text style={styles.emptyText}>
            No saved recipes yet. Start saving your favorites!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundAlt,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundAlt,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backBtn: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderRadius: 8,
    elevation: 1,
  },
  backBtnText: { color: "#0a7ea4", fontWeight: "bold", fontSize: 16 },
  header: {
    marginBottom: 18,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.white,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: Colors.light.border,
  },
  title: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: 48,
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
  },
});

//TODO: Implement a function to sort saved recipes by title or date saved
