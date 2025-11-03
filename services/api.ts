import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { TokenManager } from "./tokenManager";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://technolifestore.com/api/gym-tracker";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isAuthEndpoint = config.url?.startsWith("/auth/");
    const skipAuth = (config as any).skipAuth;

    if (!isAuthEndpoint && !skipAuth) {
      const accessToken = await TokenManager.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.startsWith("/auth/") &&
      !originalRequest._retry &&
      !(originalRequest as any).skipAuth
    ) {
      originalRequest._retry = true;

      try {
        await refreshTokenIfNeeded();

        const accessToken = await TokenManager.getAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        throw new Error("Authentication failed. Please login again.");
      }
    }

    if (error.response) {
      const message =
        (error.response.data as any)?.message ||
        error.response.data ||
        error.message ||
        `HTTP error! status: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

/**
 */
async function refreshTokenIfNeeded(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return;
  }

  isRefreshing = true;

  const { AuthService } = await import("./authService");
  refreshPromise = AuthService.refreshAccessToken();

  try {
    await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

interface ApiRequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    try {
      const response = await axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async get<T>(
    endpoint: string,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  static async post<T>(
    endpoint: string,
    data?: unknown,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      data,
    });
  }

  static async put<T>(
    endpoint: string,
    data?: unknown,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      data,
    });
  }

  static async patch<T>(
    endpoint: string,
    data?: unknown,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      data,
    });
  }

  static async delete<T>(
    endpoint: string,
    config: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  static getInstance(): AxiosInstance {
    return axiosInstance;
  }
}
