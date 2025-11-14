import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AuthService } from "@/services/authService";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      isInitialized: false,

      initialize: async () => {
        try {
          set({ isLoading: true });
          const savedUser = await AuthService.getUser();
          const isAuth = await AuthService.isAuthenticated();

          if (savedUser && isAuth) {
            set({ user: savedUser });
          } else {
            set({ user: null });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ user: null });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response: AuthResponse = await AuthService.login(credentials);
          set({ user: response.user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true });
          const response: AuthResponse = await AuthService.register(
            credentials
          );
          set({ user: response.user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async (token: string) => {
        try {
          set({ isLoading: true });
          const response: AuthResponse = await AuthService.loginWithGoogle(
            token
          );
          set({ user: response.user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await AuthService.logout();
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error("Logout error:", error);
          set({ user: null, isLoading: false });
        }
      },

      refreshUser: async () => {
        try {
          const savedUser = await AuthService.getUser();
          if (savedUser) {
            set({ user: savedUser });
          }
        } catch (error) {
          console.error("Refresh user error:", error);
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "AuthStore",
      enabled: __DEV__,
    }
  )
);

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const logout = useAuthStore((state) => state.logout);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
  };
};

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
