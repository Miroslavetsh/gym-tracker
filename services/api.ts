import { TokenManager } from "./tokenManager";

const API_BASE_URL = "https://technolifestore.com/api/gym-tracker";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiService {
  private static async getHeaders(includeAuth = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const accessToken = await TokenManager.getAccessToken();
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return headers;
  }

  private static async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const isAuthEndpoint = endpoint.startsWith("/auth/");

    const headers = await this.getHeaders(!isAuthEndpoint && !options.skipAuth);

    const response = await fetch(url, {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    });

    if (
      response.status === 401 &&
      !isAuthEndpoint &&
      retryCount === 0 &&
      !options.skipAuth
    ) {
      try {
        await this.refreshTokenIfNeeded();

        const newHeaders = await this.getHeaders(true);
        const retryResponse = await fetch(url, {
          headers: {
            ...newHeaders,
            ...options.headers,
          },
          ...options,
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        return retryResponse.json();
      } catch (refreshError) {
        throw new Error("Authentication failed. Please login again.");
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private static async refreshTokenIfNeeded(): Promise<void> {
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
      return;
    }

    isRefreshing = true;
    
    // Используем динамический импорт чтобы избежать циклической зависимости
    const { AuthService } = await import("./authService");
    refreshPromise = AuthService.refreshAccessToken();

    try {
      await refreshPromise;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  static async get<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static async post<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async put<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async patch<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
