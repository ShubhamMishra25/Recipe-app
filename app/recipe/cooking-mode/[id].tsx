import { Colors } from "@/constants/Colors";
import recipeService from "@/services/recipeService";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CookingMode() {
  useKeepAwake(); // Keeps the screen awake
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const { data } = await recipeService.getRecipeById(id);
      setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  if (loading || !recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </SafeAreaView>
    );
  }

  const steps =
    Array.isArray(recipe.steps) && recipe.steps.length > 0
      ? recipe.steps
      : ["No steps available."];

  const nextStep = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍🍳 Cooking Mode</Text>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
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
    backgroundColor: Colors.light.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: Colors.light.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  recipeTitle: {
    color: Colors.light.warning,
    fontSize: 20,
    fontWeight: "800",
  },
  stepContainer: {
    backgroundColor: Colors.light.white,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 32,
    width: width - 48,
    alignItems: "center",
    marginBottom: 32,
    minHeight: 200,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepLabel: {
    color: Colors.light.primary,
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepText: {
    color: Colors.light.text,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 32,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 48,
    marginBottom: 32,
    gap: 12,
  },
  navBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  navBtnDisabled: {
    backgroundColor: Colors.light.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  navBtnText: {
    color: Colors.light.white,
    fontWeight: "800",
    fontSize: 14,
  },
  exitBtn: {
    backgroundColor: Colors.light.error,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
    width: width - 48,
    shadowColor: Colors.light.error,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  exitBtnText: {
    color: Colors.light.white,
    fontWeight: "800",
    fontSize: 16,
  },
});
