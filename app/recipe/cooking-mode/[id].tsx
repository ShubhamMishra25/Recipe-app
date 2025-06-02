import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";

const mockRecipe = {
  id: "1",
  title: "Spaghetti Carbonara",
  steps: [
    "Boil pasta until al dente.",
    "Fry pancetta until crispy.",
    "Mix eggs and cheese.",
    "Combine all and season.",
  ],
};

export default function CookingMode() {
  useKeepAwake(); // Keeps the screen awake
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);

  // In a real app, fetch recipe by id
  const steps = mockRecipe.steps;

  const nextStep = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍🍳 Cooking Mode</Text>
        <Text style={styles.recipeTitle}>{mockRecipe.title}</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.stepLabel}>
          Step {stepIndex + 1} of {steps.length}
        </Text>
        <Text style={styles.stepText}>{steps[stepIndex]}</Text>
      </View>
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, stepIndex === 0 && styles.navBtnDisabled]}
          onPress={prevStep}
          disabled={stepIndex === 0}
        >
          <Text style={styles.navBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navBtn,
            stepIndex === steps.length - 1 && styles.navBtnDisabled,
          ]}
          onPress={nextStep}
          disabled={stepIndex === steps.length - 1}
        >
          <Text style={styles.navBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
        <Text style={styles.exitBtnText}>Exit Cooking Mode</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recipeTitle: {
    color: "#FFB300",
    fontSize: 20,
    fontWeight: "bold",
  },
  stepContainer: {
    backgroundColor: "#222",
    borderRadius: 18,
    padding: 32,
    width: width - 48,
    alignItems: "center",
    marginBottom: 32,
    minHeight: 180,
    justifyContent: "center",
  },
  stepLabel: {
    color: "#FFB300",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  stepText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 48,
    marginBottom: 32,
  },
  navBtn: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  navBtnDisabled: {
    backgroundColor: "#444",
  },
  navBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  exitBtn: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
    width: width - 48,
  },
  exitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
