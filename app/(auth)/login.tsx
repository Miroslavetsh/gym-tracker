import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { AuthContainer } from "@/components/auth/auth-container";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";
import { logApiInfo } from "@/utils/apiDiagnostics";

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    if (__DEV__) {
      logApiInfo();
    }
  }, []);

  return (
    <AuthContainer>
      <AuthHeader title="Вхід" subtitle="Введіть ваші дані для входу" />

      <View style={styles.form}>
        <LoginForm />
        {/* TODO: Add Google Auth Button later
         <AuthDivider />
        <GoogleAuthButton /> */}
        <AuthFooter
          text="Немає акаунта?"
          linkText="Зареєструватися"
          onLinkPress={() => router.push("/register")}
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
