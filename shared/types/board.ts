export interface BoardIdsResponse {
  boardId: number;
}

export interface IBoard {
  boardId: number;
  title: string;
  description: string;
  userId: number;
  username: string;
  email: string;
  categoryId: number;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  categoryId: number;
  name: string;
}

export interface IComment {
  commentId: number;
  text: string;
  userId: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  commentId: number;
  text: string;
  userId: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBoardForm {
  title: string;
  description: string;
  categoryId: number;
}

export interface UpdateBoardForm extends Partial<CreateBoardForm> {}

export interface CommentRequest {
  text: string;
}

export interface CommentForm {
  text: string;
}

export interface CreateCommentRequest extends CommentForm {}

export interface UpdateCommentRequest extends CommentForm {}
