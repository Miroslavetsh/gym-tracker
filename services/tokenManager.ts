import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";

export class TokenManager {
  static async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  static async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }

  static async clearAccessToken(): Promise<void> {
    await Promise.all([SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)]);
  }
}
