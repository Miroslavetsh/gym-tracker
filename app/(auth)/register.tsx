import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AuthContainer } from "@/components/auth/auth-container";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <AuthContainer>
      <AuthHeader
        title="Реєстрація"
        subtitle="Створіть новий акаунт"
      />

      <View style={styles.form}>
        <RegisterForm />

        <AuthFooter
          text="Вже є акаунт?"
          linkText="Увійти"
          onLinkPress={() => router.push("/login")}
        />
      </View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
});
