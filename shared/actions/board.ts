import axios from 'axios';

export const createBoardAction = async (form: any): Promise<any> =>
  await axios.post('http://localhost:8080/api/v1/board', form);

export const editBoardAction = async (boardId: number, form: any): Promise<any> =>
  await axios.patch(`http://localhost:8080/api/v1/board/${boardId}`, form);

export const deleteBoardAction = async (boardId: number): Promise<any> =>
  await axios.delete(`http://localhost:8080/api/v1/board/${boardId}`);

export const createCommentAction = async (boardId: number, form: any): Promise<any> =>
  await axios.post(`http://localhost:8080/api/v1/board/${boardId}/comment`, form);

export const deleteCommentAction = async (boardId: number, commentId: number): Promise<any> =>
  await axios.delete(`http://localhost:8080/api/v1/board/${boardId}/comment/${commentId}`);

export const editCommentAction = async (boardId: number, commentId: number, form: any): Promise<any> =>
  await axios.patch(`http://localhost:8080/api/v1/board/${boardId}/comment/${commentId}`, form);
