import { BOARD_URI, TOKEN } from '../enums';
import axios from '../utils/axios';
import fetcher from '../utils/fetcher';
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

export const getBoard = (boardId: number | string) => async (): Promise<IBoard | null> =>
  fetcher(`${BOARD_URI}/${boardId}`);

export const createBoard = async () => {
  try {
    await axios.post(
      BOARD_URI,
      {
        title: 'title sample',
        description: 'description sample',
        categoryId: 1
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
        }
      }
    );
  } catch (e) {
    alert(e.response.messages);
    console.log(e);
  }
};

export const updateBoard = async (id: string | number): Promise<void> => {
  try {
    await axios.patch(
      `${BOARD_URI}/${id}`,
      {
        title: '[edit] title sample',
        description: '[edit] description sample',
        categoryId: 1
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
        }
      }
    );
  } catch (e) {
    alert(e.response.messages);
    console.log(e);
  }
};
export const deleteBoard = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`${BOARD_URI}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
      }
    });
  } catch (e) {
    alert(e.response.messages);
    console.log(e);
  }
};
