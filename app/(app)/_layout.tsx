import { Stack } from "expo-router";
import { useAuth } from "~/providers/auth-providers";

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="services"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Edit Profile",
        }}
      />

      <Stack.Screen
        name="vehicle"
        options={{
          headerShown: false,
          title: "Your Cars",
        }}
      />
    </Stack>
  );
}
