import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterCredentials } from "@/types/auth";
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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Підтвердіть пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Паролі не співпадають";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const credentials: RegisterCredentials = {
        email: email.trim(),
        password,
        name: name.trim(),
      };
      await register(credentials);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Помилка реєстрації",
        error instanceof Error
          ? error.message
          : "Не вдалося зареєструватися. Спробуйте ще раз."
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
              Реєстрація
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Створіть новий акаунт
            </ThemedText>

            <View style={styles.form}>
              <Input
                label="Ім'я"
                value={name}
                onChangeText={setName}
                placeholder="Введіть ваше ім'я"
                autoCapitalize="words"
                autoComplete="name"
                error={errors.name}
                showClearButton
              />

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
              />

              <Input
                label="Пароль"
                value={password}
                onChangeText={setPassword}
                placeholder="Введіть пароль (мін. 6 символів)"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                error={errors.password}
              />

              <Input
                label="Підтвердіть пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Введіть пароль ще раз"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                error={errors.confirmPassword}
              />

              <Button
                title="Зареєструватися"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
              />

              <View style={styles.footer}>
                <ThemedText type="default" style={styles.footerText}>
                  Вже є акаунт?{" "}
                </ThemedText>
                <Button
                  title="Увійти"
                  onPress={() => router.push("/login")}
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
  registerButton: {
    marginTop: 8,
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
