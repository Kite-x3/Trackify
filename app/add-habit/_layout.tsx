import { Stack } from "expo-router";

export default function AddHabitLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Новая привычка",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
