export interface UserProps {
  isLoggedIn: boolean;
  token?: string;
  email?: string;
  username?: string;
  userId?: number;
}

export interface UserLoginForm {
  email: string;
  password: string;
}

export interface UserJoinForm {
  email: string;
  password: string;
  username: string;
}
