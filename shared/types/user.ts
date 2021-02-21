export interface IUser {
  email: string;
  username: string;
  userId: number;
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
