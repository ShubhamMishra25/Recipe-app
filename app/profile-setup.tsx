import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import userService from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const allPrefs = ["Vegetarian", "Vegan", "Low Carb", "Gluten Free", "Keto"];

export default function ProfileSetup() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
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
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
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
              avatar ? { uri: avatar } : require("@/assets/images/avatar.png")
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
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundAlt,
  },
  inner: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.light.text,
    marginBottom: 28,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
    backgroundColor: Colors.light.border,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  avatarEdit: {
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "800",
    fontSize: 14,
  },
  input: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
    fontSize: 15,
    width: 280,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontWeight: "800",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 12,
    color: Colors.light.text,
    alignSelf: "flex-start",
    letterSpacing: 0.2,
  },
  prefRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  prefBtn: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    margin: 3,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  prefBtnActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  prefBtnText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  prefBtnTextActive: {
    color: Colors.light.white,
  },
  saveBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 28,
    width: 240,
    shadowColor: Colors.light.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    color: Colors.light.white,
    fontWeight: "800",
    fontSize: 16,
  },
});
