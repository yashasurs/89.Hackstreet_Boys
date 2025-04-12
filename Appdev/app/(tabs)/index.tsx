import React from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter, Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token) {
    return <Redirect href="../screen/register" />;
  }

  const features = [
    {
      title: "PDF Generation",
      description: "Convert your content into beautifully formatted PDF documents with one click.",
      icon: icons.pdf, // Ensure this icon exists in your icons file
    },
    {
      title: "Custom Lesson Plans",
      description: "Create personalized lesson plans tailored to specific learning objectives.",
      icon: icons.lesson, // Ensure this icon exists in your icons file
    },
    {
      title: "AI-Powered Content",
      description: "Leverage advanced AI to generate high-quality educational materials.",
      icon: icons.ai, // Ensure this icon exists in your icons file
    },
    {
      title: "Interactive Quizzes",
      description: "Engage students with interactive quizzes to test their knowledge and understanding.",
      icon: icons.quiz, // Ensure this icon exists in your icons file
    },
  ];

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={icons.logo} style={styles.logo} />
        <Text style={styles.logoText}>BrightMind</Text>
      </View>

      {/* Background Image */}
      <Image
        source={images.bg}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={2}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Transform Learning with AI-Generated Educational Content
          </Text>
          <Text style={styles.heroSubtitle}>
            Create comprehensive study materials with personalized PDF generation in seconds.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("../generate-content")}
            >
              <Text style={styles.primaryButtonText}>Generate Content</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("../learn-more")}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Features Section */}
        <Text style={styles.sectionTitle}>Key Features</Text>
        <Text style={styles.sectionSubtitle}>
          Discover how BrightMind helps educators create engaging and professional learning materials.
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Image source={feature.icon} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0D0D0D",
    zIndex: 10,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    color: "#8000FF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    color: "#bbb",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#8000FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#8000FF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8000FF",
  },
  secondaryButtonText: {
    color: "#8000FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: "48%",
    shadowColor: "#9A40FF",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  featureTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featureDescription: {
    color: "#bbb",
    fontSize: 14,
    lineHeight: 20,
  },
});
