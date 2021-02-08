import { IUser } from './user';

export interface IComment extends Omit<IUser, 'email'> {
  commentId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentCreateRequest {
  text: string;
}

export interface ICommentUpdateRequest extends Partial<ICommentCreateRequest> {}
