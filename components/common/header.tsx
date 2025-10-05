import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";

type HeaderProps = {
  title: string;
  icon: string;
  iconColor?: string;
  onClear?: () => void;
  onToggleFilters?: () => void;
  showClearButton?: boolean;
  showToggleFiltersButton?: boolean;
  filtersVisible?: boolean;
  clearButtonTitle?: string;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  icon,
  iconColor = "#007AFF",
  onClear,
  onToggleFilters,
  showClearButton = false,
  showToggleFiltersButton = false,
  filtersVisible = true,
  clearButtonTitle = "Очистити",
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <IconSymbol
          name={icon as any}
          size={24}
          color={iconColor}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.headerButtons}>
        {showToggleFiltersButton && onToggleFilters && (
          <Button
            title={filtersVisible ? "Сховати" : "Показати"}
            onPress={onToggleFilters}
            icon={filtersVisible ? "chevron.up" : "chevron.down"}
            style={styles.toggleButton}
          />
        )}
        {showClearButton && onClear && (
          <Button
            title={clearButtonTitle}
            onPress={onClear}
            variant="secondary"
            icon="trash"
            style={styles.clearButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
