import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="delivery" />
      <Stack.Screen name="catering" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
}