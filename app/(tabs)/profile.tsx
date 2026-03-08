import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/common/themed-view";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/profile/logout-button";
import { ProfileHeader } from "@/components/profile/profile-header";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.content}>
        <ProfileHeader />
        <View style={styles.linkSection}>
          <Button
            title="Статистика"
            onPress={() => router.push("/statistics")}
            icon="chart.bar"
            variant="secondary"
            style={styles.statisticsButton}
          />
        </View>
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
  linkSection: {
    marginBottom: 24,
  },
  statisticsButton: {
    alignSelf: "flex-start",
  },
});
