import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterCredentials,
  User,
} from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { ApiService } from "./api";
import { TokenManager } from "./tokenManager";

const USER_KEY = "user_data";

export class AuthService {
  private static async saveToken(accessToken: string): Promise<void> {
    await TokenManager.setAccessToken(accessToken);
  }

  static async getAccessToken(): Promise<string | null> {
    return await TokenManager.getAccessToken();
  }

  static async saveUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  }

  static async getUser(): Promise<User | null> {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static async register(
    credentials: RegisterCredentials
  ): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>(
        "/auth/register",
        credentials
      );

      await this.saveToken(response.accessToken);
      await this.saveUser(response.user);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      await this.saveToken(response.accessToken);
      await this.saveUser(response.user);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>("/auth/google", {
        token: googleToken,
      });

      await this.saveToken(response.accessToken);
      await this.saveUser(response.user);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async refreshAccessToken(): Promise<string> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await ApiService.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          accessToken,
        }
      );

      await TokenManager.setAccessToken(response.accessToken);

      return response.accessToken;
    } catch (error) {
      await this.logout();
      throw this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await ApiService.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await TokenManager.clearAccessToken();
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return accessToken !== null;
  }

  private static handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === "object" && error !== null && "message" in error) {
      return new Error(String(error.message));
    }
    return new Error("An unknown error occurred");
  }
}
