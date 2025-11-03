import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/common/themed-text";

export function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <ThemedText type="defaultSemiBold" style={styles.text}>
        або
      </ThemedText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#C7C7CC",
  },
  text: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.6,
  },
});

