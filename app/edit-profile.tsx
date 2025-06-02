import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const mockUser = {
  name: "Shubham Mishra",
  email: "shubham@example.com",
  avatar: require("@/assets/images/avatar.png"),
  preferences: ["Vegetarian", "Low Carb"],
};

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>(
    mockUser.preferences
  );

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // TODO: Save profile changes (Appwrite integration)
    router.back();
  };
  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const allPrefs = ["Vegetarian", "Vegan", "Low Carb", "Gluten Free", "Keto"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            source={avatar ? { uri: avatar } : mockUser.avatar}
            style={styles.avatar}
          />
          <Text style={styles.avatarEdit}>Change Avatar</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
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
