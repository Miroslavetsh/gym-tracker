import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

/**
 * Сервис для работы с Google OAuth
 *
 * Для настройки Google OAuth вам нужно:
 * 1. Создать проект в Google Cloud Console (https://console.cloud.google.com/)
 * 2. Включить Google+ API
 * 3. Создать OAuth 2.0 Client ID
 * 4. Добавить redirect URI:
 *    - Для iOS: `gymtracker://` или `com.mytoloshnyi.gymtracker://`
 *    - Для Android: `gymtracker://` или ваш package name
 *    - Для Web: `http://localhost:8081` или ваш домен
 * 5. Добавить Client ID и Client Secret в переменные окружения или конфигурацию
 */

// TODO: Замените на ваш Google Client ID из Google Cloud Console
const GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
const GOOGLE_CLIENT_ID_IOS =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID_ANDROID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID_WEB =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || GOOGLE_CLIENT_ID;

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "gymtracker",
  path: "auth/google",
});

export interface GoogleAuthResult {
  accessToken: string | null;
  idToken: string | null;
  error: string | null;
}

export class GoogleAuthService {
  private static getClientId(): string {
    if (Platform.OS === "ios") {
      return GOOGLE_CLIENT_ID_IOS;
    } else if (Platform.OS === "android") {
      return GOOGLE_CLIENT_ID_ANDROID;
    } else {
      return GOOGLE_CLIENT_ID_WEB;
    }
  }

  private static getDiscovery(): AuthSession.DiscoveryDocument {
    return {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    };
  }

  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      const clientId = this.getClientId();
      const discovery = this.getDiscovery();

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ["openid", "profile", "email"],
        redirectUri: REDIRECT_URI,
        responseType: AuthSession.ResponseType.Token,
        extraParams: {},
      });

      const result = await request.promptAsync(discovery, {
        showInRecents: true,
      });

      if (result.type === "success") {
        return {
          accessToken: result.params.access_token || null,
          idToken: result.params.id_token || null,
          error: null,
        };
      } else if (result.type === "cancel") {
        return {
          accessToken: null,
          idToken: null,
          error: "Google sign in was cancelled",
        };
      } else {
        return {
          accessToken: null,
          idToken: null,
          error: result.type || "Unknown error occurred",
        };
      }
    } catch (error) {
      return {
        accessToken: null,
        idToken: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
      };
    }
  }

  static async signInWithGoogleCodeFlow(
    codeVerifier: string,
    codeChallenge: string
  ): Promise<GoogleAuthResult> {
    try {
      const clientId = this.getClientId();
      const discovery = this.getDiscovery();

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ["openid", "profile", "email"],
        redirectUri: REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        },
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      });

      const result = await request.promptAsync(discovery, {
        showInRecents: true,
      });

      if (result.type === "success" && result.params.code) {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId,
            code: result.params.code,
            redirectUri: REDIRECT_URI,
            extraParams: {
              code_verifier: codeVerifier,
            },
          },
          discovery
        );

        return {
          accessToken: tokenResult.accessToken || null,
          idToken: tokenResult.idToken || null,
          error: null,
        };
      } else if (result.type === "cancel") {
        return {
          accessToken: null,
          idToken: null,
          error: "Google sign in was cancelled",
        };
      } else {
        return {
          accessToken: null,
          idToken: null,
          error: result.type,
        };
      }
    } catch (error) {
      return {
        accessToken: null,
        idToken: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
      };
    }
  }
}
