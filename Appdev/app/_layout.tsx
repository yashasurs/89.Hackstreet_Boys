import { Stack, Slot } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Hide the status bar */}
      <StatusBar hidden={true} />

      {/* Use a Slot for the root navigator for better navigation stability */}
      <Slot />
    </AuthProvider>
  );
}