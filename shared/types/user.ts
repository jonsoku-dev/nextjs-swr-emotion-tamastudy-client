export interface UserProps {
  isLoggedIn: boolean;
  token: string | null;
  email?: string;
  username?: string;
  userId?: number;
}

export interface IUser {
  isLoggedIn: boolean;
  email?: string;
  username?: string;
  userId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JoinRequest {
  email: string;
  password: string;
  username: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  id: number | string;
  token: string;
  refreshToken: string;
}
export interface UserAuthenticateResponse {
  email: string;
  username: string;
  userId: number;
}
