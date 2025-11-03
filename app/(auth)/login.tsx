import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleAuthService } from "@/services/googleAuthService";
import { LoginCredentials } from "@/types/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email обов'язковий";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Невірний формат email";
    }

    if (!password) {
      newErrors.password = "Пароль обов'язковий";
    } else if (password.length < 6) {
      newErrors.password = "Пароль має бути мінімум 6 символів";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const credentials: LoginCredentials = { email: email.trim(), password };
      await login(credentials);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Помилка входу",
        error instanceof Error
          ? error.message
          : "Не вдалося увійти. Спробуйте ще раз."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Вхід
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Введіть ваші дані для входу
            </ThemedText>

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                showClearButton
                style={{ color: "white" }}
              />

              <Input
                label="Пароль"
                value={password}
                onChangeText={setPassword}
                placeholder="Введіть пароль"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                error={errors.password}
                style={{ color: "white" }}
              />

              <Button
                title="Увійти"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText type="defaultSemiBold" style={styles.dividerText}>
                  або
                </ThemedText>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Увійти через Google"
                onPress={handleGoogleLogin}
                variant="secondary"
                icon="globe"
                style={styles.googleButton}
                disabled={isLoading}
              />

              <View style={styles.footer}>
                <ThemedText type="default" style={styles.footerText}>
                  Немає акаунта?{" "}
                </ThemedText>
                <Button
                  title="Зареєструватися"
                  onPress={() => router.push("/register")}
                  variant="secondary"
                  style={styles.linkButton}
                  textStyle={styles.linkButtonText}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
  },
  form: {
    width: "100%",
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C7C7CC",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.6,
  },
  googleButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
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
