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
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
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
  icon,
  iconSize = 16,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <IconSymbol
            name={icon as SymbolViewProps["name"]}
            size={iconSize}
            color={
              disabled
                ? "#8E8E93"
                : variant === "primary" ||
                  variant === "secondary" ||
                  variant === "danger"
                ? "#FFFFFF"
                : "#000000"
            }
            style={styles.icon}
          />
        )}
        <Text style={buttonTextStyle}>{title}</Text>
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
});
