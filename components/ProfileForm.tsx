import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image,
  ScrollView, ActivityIndicator, Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const allPrefs = ["Vegetarian", "Vegan", "Low Carb", "Gluten Free", "Keto"];

export default function ProfileForm({
  initialName = "",
  initialAvatar = null,
  initialPreferences = [],
  loading = false,
  submitting = false,
  onSubmit,
  title = "Set Up Your Profile",
  buttonText = "Save Profile"
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [preferences, setPreferences] = useState<string[]>(initialPreferences);

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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }
    onSubmit({ name, avatar, preferences });
  };

  return (
    <ScrollView contentContainerStyle={styles.inner}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={pickAvatar}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("@/assets/images/avatar.png")
          }
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
          <Text style={styles.saveBtnText}>{buttonText}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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