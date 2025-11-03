import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { GoogleAuthService } from "@/services/googleAuthService";
import { useAuth } from "@/stores/authStore";

export function GoogleAuthButton() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await GoogleAuthService.signInWithGoogle();

      if (result.error) {
        if (result.error !== "Google sign in was cancelled") {
          Alert.alert("Помилка", result.error);
        }
        return;
      }

      if (!result.idToken && !result.accessToken) {
        Alert.alert("Помилка", "Не вдалося отримати токен від Google");
        return;
      }

      const token = result.idToken || result.accessToken;
      if (token) {
        await loginWithGoogle(token);
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error
          ? error.message
          : "Не вдалося увійти через Google"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      title="Увійти через Google"
      onPress={handleGoogleLogin}
      variant="secondary"
      icon="globe"
      style={styles.button}
      disabled={isLoading}
      loading={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
  },
});

