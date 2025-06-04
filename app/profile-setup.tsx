import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import userService from "@/services/userService";

const allPrefs = ["Vegetarian", "Vegan", "Low Carb", "Gluten Free", "Keto"];

export default function ProfileSetup() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if(!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </SafeAreaView>
    );
  }

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }
    setSubmitting(true);

    const existing = await userService.getUserByAuthId(user.$id);
    if (existing && existing.error) {
      setSubmitting(false);
      router.replace("/home");
      return;
    }

    // TODO: Upload avatar to Appwrite Storage and get avatarId
    // For now, just save the avatar URI as a placeholder

    const data = {
      name,
      preferences,
      avatarId: avatar || null,
      authUserId: user.$id,
      email: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await userService.createUserProfile(data);

    setSubmitting(false);

    if (!response?.error) {
      router.replace("/home");
    } else {
      Alert.alert("Error", response.error || "Failed to save profile.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("@/assets/images/avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.avatarEdit}>Add Avatar</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <View style={styles.prefRow}>
          {allPrefs.map((pref) => (
            <TouchableOpacity
              key={pref}
              style={[
                styles.prefBtn,
                preferences.includes(pref) && styles.prefBtnActive,
              ]}
              onPress={() => togglePreference(pref)}
            >
              <Text
                style={[
                  styles.prefBtnText,
                  preferences.includes(pref) && styles.prefBtnTextActive,
                ]}
              >
                {pref}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6" },
  inner: {
    alignItems: "center",
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0a7ea4",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  avatarEdit: {
    color: "#0a7ea4",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    width: 260,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 8,
    color: "#0a7ea4",
    alignSelf: "flex-start",
  },
  prefRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  prefBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 2,
    borderWidth: 1,
    borderColor: "#0a7ea4",
  },
  prefBtnActive: {
    backgroundColor: "#0a7ea4",
  },
  prefBtnText: {
    color: "#0a7ea4",
    fontSize: 14,
  },
  prefBtnTextActive: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    width: 220,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});