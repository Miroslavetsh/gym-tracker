import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/authStore";
import {
  registerSchema,
  RegisterFormData,
} from "@/lib/validations/authSchemas";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await register({
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
      });
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
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Ім'я"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Введіть ваше ім'я"
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name?.message}
            showClearButton
          />
        )}
      />

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
            placeholder="Введіть пароль (мін. 6 символів)"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Підтвердіть пароль"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Введіть пароль ще раз"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <Button
        title="Зареєструватися"
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

