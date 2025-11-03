import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/common/themed-text";
import { Button } from "@/components/ui/button";

interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkPress: () => void;
}

export function AuthFooter({ text, linkText, onLinkPress }: AuthFooterProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.text}>
        {text}{" "}
      </ThemedText>
      <Button
        title={linkText}
        onPress={onLinkPress}
        variant="secondary"
        style={styles.linkButton}
        textStyle={styles.linkButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  text: {
    fontSize: 14,
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  linkButtonText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

