import { USER_URI } from '../enums';
import fetcher from '../utils/fetcher';

export interface IUser {
  id: number;
  username: string;
  email: string;
}

export const getUser = async (): Promise<IUser | null> => fetcher(USER_URI.GET_USER);
