import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/common/themed-text";
import { useAuthUser } from "@/stores/authStore";

export function ProfileHeader() {
  const user = useAuthUser();

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Профіль
      </ThemedText>
      {user && (
        <ThemedText type="default" style={styles.userInfo}>
          {user.name} ({user.email})
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 16,
    opacity: 0.7,
  },
});
