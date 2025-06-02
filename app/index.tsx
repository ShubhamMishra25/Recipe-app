import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.emoji}>🍲</Text>
        <Text style={styles.title}>Welcome to Recipe App</Text>
        <Text style={styles.tagline}>
          Your kitchen companion for delicious discoveries!
        </Text>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>🍳 Start your culinary journey today!</Text>

        {/* Testing */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/recipe/1")}
        >
          <Text style={styles.buttonText}>Test</Text>
        </TouchableOpacity>
        {/* Testing */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#0a7ea4",
  },
  tagline: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 32,
    textAlign: "center",
    fontStyle: "italic",
  },
  divider: {
    width: 80,
    height: 4,
    backgroundColor: "#FF6B6B",
    borderRadius: 2,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    width: 220,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  signupButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  footer: {
    marginTop: 40,
    fontSize: 15,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
});
