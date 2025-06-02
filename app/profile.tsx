import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const mockUser = {
  name: "Shubham Mishra",
  email: "shubham@example.com",
  avatar: require("@/assets/images/avatar.png"), // Add a placeholder avatar image
  preferences: ["Vegetarian", "Low Carb"],
};

export default function ProfilePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image source={mockUser.avatar} style={styles.avatar} />
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.email}>{mockUser.email}</Text>
        <View style={styles.prefContainer}>
          {mockUser.preferences.map((pref, index) => (
            <Text key={index} style={styles.pref}>
              {pref}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            // Handle logout logic here
            console.log("Logout pressed");
          }}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6" },
  inner: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 48,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 18,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0a7ea4",
    marginBottom: 4,
  },
  email: { fontSize: 16, color: "#888", marginBottom: 16 },
  prefContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pref: {
    backgroundColor: "#0a7ea4",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 2,
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 18,
    width: 180,
  },
  editBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    width: 180,
  },
  logoutBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
