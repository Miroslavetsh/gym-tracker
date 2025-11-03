import { useRouter, useSegments } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { useAuth } from "@/contexts/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments?.length > 0 && segments[0] === "(auth)";
    const inTabsGroup = segments?.length > 0 && segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup && inTabsGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText type="default" style={styles.loadingText}>
          Завантаження...
        </ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
