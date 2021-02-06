import { BasePaging } from './shared';

export interface IBoard {
  boardId: number;
  title: string;
  description: string;
  userId: number;
  username: string;
  email: string;
  categoryId: number;
  categoryName: string;
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
