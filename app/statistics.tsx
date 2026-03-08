import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { CombinedProgressChart } from "@/components/charts/combined-progress-chart";
import { Button } from "@/components/ui/button";

export default function StatisticsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Button
          title="Назад"
          onPress={() => router.back()}
          icon="chevron.left"
          variant="secondary"
          style={styles.backButton}
        />
      </View>
      <CombinedProgressChart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    alignSelf: "flex-start",
  },
});
