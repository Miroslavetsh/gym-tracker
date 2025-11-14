import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/authStore";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Вихід",
      "Ви впевнені, що хочете вийти?",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Вийти",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "Помилка",
                error instanceof Error
                  ? error.message
                  : "Не вдалося вийти. Спробуйте ще раз."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Вийти"
        onPress={handleLogout}
        variant="danger"
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  button: {
    width: "100%",
  },
});

