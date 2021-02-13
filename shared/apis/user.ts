export interface IUser {
  userId: number;
  username: string;
  email: string;
}

export interface UserProps {
  isLoggedIn: boolean;
  token?: string;
  userId?: number;
  username?: string;
  email?: string;
}

export interface IUserCreateRequest {}

export interface IUserUpdateRequest extends Partial<IUserCreateRequest> {}
