import React from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  onSave: () => void;
  onClear: () => void;
  loading?: boolean;
  saveButtonTitle?: string;
  clearButtonTitle?: string;
  saveButtonIcon?: string;
  clearButtonIcon?: string;
};

export function ActionButtons({
  onSave,
  onClear,
  loading = false,
  saveButtonTitle = "Зберегти",
  clearButtonTitle = "Очистити все",
  saveButtonIcon = "checkmark.circle.fill",
  clearButtonIcon = "trash",
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        title={saveButtonTitle}
        onPress={onSave}
        disabled={loading}
        style={styles.saveButton}
        icon={saveButtonIcon}
      />
      <Button
        title={clearButtonTitle}
        variant="secondary"
        onPress={onClear}
        style={styles.clearButton}
        icon={clearButtonIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
});
