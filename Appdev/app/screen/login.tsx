import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { images } from "@/constants/images"; // Import the background image

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to store error message
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch("http://172.16.14.94:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Use AuthContext to save token and user
      login(data.token, data.user);

      Alert.alert("Success", "Login successful!");
      router.push("/"); // Redirect to home or dashboard
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage); // Set the error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={images.bg} // Use the same background image as index.tsx
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        {error && <Text style={styles.errorText}>{error}</Text>} {/* Display error message */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#A8B5DB"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A8B5DB"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 1, // Ensure content is above the background image
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "#FF3B30", // Red color for errors
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2E2E3E",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});