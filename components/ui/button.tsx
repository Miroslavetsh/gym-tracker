import { SymbolViewProps } from "expo-symbols";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { IconSymbol } from "./icon-symbol";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "loading" | "success";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconSize?: number;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  iconSize = 16,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && !loading && (
          <IconSymbol
            name={icon as SymbolViewProps["name"]}
            size={iconSize}
            color={
              disabled || loading
                ? "#8E8E93"
                : variant === "primary" ||
                  variant === "secondary" ||
                  variant === "danger" ||
                  variant === "loading" ||
                  variant === "success"
                ? "#FFFFFF"
                : "#000000"
            }
            style={styles.icon}
          />
        )}
        <Text style={buttonTextStyle}>
          {loading ? "Завантаження..." : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#8E8E93",
  },
  danger: {
    backgroundColor: "#FF3B30",
  },
  loading: {
    backgroundColor: "#007AFF",
  },
  success: {
    backgroundColor: "#11BF01",
  },
  disabled: {
    backgroundColor: "#C7C7CC",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: "#8E8E93",
  },
  loadingText: {
    color: "#FFFFFF",
  },
  successText: {
    color: "#FFFFFF",
  },
});
