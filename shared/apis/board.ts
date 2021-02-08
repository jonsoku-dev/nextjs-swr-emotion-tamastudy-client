import { ICategory } from './category';
import { IComment } from './comment';
import { BasePaging } from './shared';
import { IUser } from './user';

export interface IBoard extends ICategory, IUser {
  boardId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  comments: IComment[];
}

export type IBoardPaging = BasePaging<IBoard>;

export interface IBoardCreateRequest {
  title: string;
  description: string;
  categoryId: number;
}

export interface IBoardUpdateRequest extends Partial<IBoardCreateRequest> {}
