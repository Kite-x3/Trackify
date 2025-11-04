import { StyledText } from "@/components/StyledText";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>Настройки</StyledText>
      <StyledText>Настройки приложения</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});
