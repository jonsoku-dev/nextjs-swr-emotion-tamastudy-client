import { AUTHENTICATE } from '../enums';
import fetcher from '../utils/fetcher';

export interface IUser {
  id: number;
  username: string;
  email: string;
}

export const getUser = async (): Promise<IUser | null> => fetcher(AUTHENTICATE);
