export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export type AuthResponse = {
  user: User;
} & RefreshTokenResponse;
