import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/authStore";
import { loginSchema, LoginFormData } from "@/lib/validations/authSchemas";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login({
        email: data.email.trim(),
        password: data.password,
      });
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

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            showClearButton
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Пароль"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Введіть пароль"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password?.message}
          />
        )}
      />

      <Button
        title="Увійти"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    marginTop: 8,
  },
});

