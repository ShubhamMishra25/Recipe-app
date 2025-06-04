import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import userService from "@/services/userService";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const data = await userService.getUserByAuthId(user.$id);
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user, isEditing]);

  const handleEditSubmit = async ({ name, avatar, preferences }) => {
    if (!profile) return;
    setSubmitting(true);
    const data = {
      name,
      preferences,
      avatarId: avatar || null,
      updatedAt: new Date().toISOString(),
    };
    const response = await userService.updateUserProfile(profile.$id, data);
    setSubmitting(false);
    if (!response?.error) {
      Alert.alert("Success", "Profile updated!");
      setIsEditing(false);
      setProfile({ ...profile, ...data });
    } else {
      Alert.alert("Error", response.error || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No profile found.
        </Text>
      </SafeAreaView>
    );
  }

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileForm
          initialName={profile.name}
          initialAvatar={profile.avatarId}
          initialPreferences={profile.preferences}
          submitting={submitting}
          onSubmit={handleEditSubmit}
          title="Edit Profile"
          buttonText="Save Changes"
        />
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={
            profile.avatarId
              ? { uri: profile.avatarId }
              : require("@/assets/images/avatar.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <View style={styles.prefContainer}>
          {profile.preferences.map((pref, index) => (
            <Text key={index} style={styles.pref}>
              {pref}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            router.replace("/auth/login");
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
  cancelBtn: {
    backgroundColor: "#888",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    margin: 24,
    width: 180,
    alignSelf: "center",
  },
  cancelBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
