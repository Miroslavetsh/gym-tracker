import { useRouter, useSegments } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { useAuthStore } from "@/stores/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!isInitialized) {
      useAuthStore.getState().initialize();
    }
  }, [isInitialized]);

  React.useEffect(() => {
    if (isLoading || !isInitialized) return;

    const inAuthGroup = segments?.length > 0 && segments[0] === "(auth)";
    const inTabsGroup = segments?.length > 0 && segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup && inTabsGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, isInitialized, segments, router]);

  if (isLoading || !isInitialized) {
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
