import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      {/* Hide the status bar */}
      <StatusBar hidden={true} />

      {/* Stack navigator with header disabled globally */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false, // Ensure tabs also have no header
          }}
        />
        <Stack.Screen
          name="screen"
          options={{
            headerShown: false, // Ensure tabs also have no header
          }}
        />
      </Stack>
    </>
  );
}