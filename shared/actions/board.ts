import axios from 'axios';

import {
  CreateBoardForm,
  CreateCommentRequest,
  IBoard,
  IComment,
  UpdateBoardForm,
  UpdateCommentRequest
} from '../types';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createBoardAction = (body: CreateBoardForm) =>
  axios.post<IBoard>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board`, body);

export const editBoardAction = (boardId: number, body: UpdateBoardForm) =>
  axios.patch<IBoard>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board/${boardId}`, body);

export const deleteBoardAction = (boardId: number) =>
  axios.delete<void>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board/${boardId}`);

export const createCommentAction = (boardId: number, body: CreateCommentRequest) =>
  axios.post<IComment>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board/${boardId}/comment`, body);

export const deleteCommentAction = (boardId: number, commentId: number) =>
  axios.delete<void>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board/${boardId}/comment/${commentId}`);

export const editCommentAction = (boardId: number, commentId: number, body: UpdateCommentRequest) =>
  axios.patch<IComment>(`${NEXT_PUBLIC_BASE_URL}/api/v1/board/${boardId}/comment/${commentId}`, body);
