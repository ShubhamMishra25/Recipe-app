import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>💾 Saved Recipes</Text>
        <FlatList
          data={savedRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        {savedRecipes.length === 0 && (
          <Text style={styles.emptyText}>No saved recipes yet. Start saving your favorites!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF5E6",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 16,
    paddingTop: 32,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#0a7ea4",
    letterSpacing: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    color: "#0a7ea4",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
});


//TODO: Implement a function to sort saved recipes by title or date saved