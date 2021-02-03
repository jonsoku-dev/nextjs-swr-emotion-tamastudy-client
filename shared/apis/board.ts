import { ICategory } from './category';
import { BasePaging } from './shared';
import { IUser } from './user';

export interface IBoard {
  id: number;
  title: string;
  description: string;
  user: IUser;
  category: ICategory;
  createdAt: string;
  updatedAt: string;
}

export type IBoardPaging = BasePaging<IBoard>;

export interface IBoardCreateRequest {
  title: string;
  description: string;
  categoryId: number;
}
export interface IBoardUpdateRequest {
  title?: string;
  description?: string;
  categoryId?: number;
}
