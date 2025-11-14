import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/common/themed-view";
import { LogoutButton } from "@/components/profile/logout-button";
import { ProfileHeader } from "@/components/profile/profile-header";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.content}>
        <ProfileHeader />
        <LogoutButton />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
