import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

interface HighlightTextProps {
  text: string;
  searchQuery: string;
  style?: TextStyle;
  highlightStyle?: TextStyle;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchQuery,
  style,
  highlightStyle,
}) => {
  if (!searchQuery.trim()) return <Text style={style}>{text}</Text>;

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        return (
          <Text
            key={index}
            style={isMatch ? [styles.highlight, highlightStyle] : undefined}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: "#FFE066",
    color: "#000000",
    fontWeight: "600",
  },
});
