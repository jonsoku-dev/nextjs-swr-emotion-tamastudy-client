export interface Paging<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  sort: Sort;
  size: number;
  number: number;
  empty: boolean;
}

export interface BoardProps {
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

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface CategoryProps {
  categoryId: number;
  name: string;
}

export interface CommentProps {
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

export interface CommentForm {
  text: string;
}
