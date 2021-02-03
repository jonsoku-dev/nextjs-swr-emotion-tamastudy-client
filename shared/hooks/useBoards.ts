import useSWR from 'swr';

import { IBoardPaging } from '../apis';
import { BOARD_URI, TOKEN } from '../enums';
import axios from '../utils/axios';

const useFetchedBoards = (initialBoards: any) => {
  const { data, error, mutate } = useSWR<IBoardPaging>(`${BOARD_URI}/v2`, {
    dedupingInterval: 1500,
    initialData: initialBoards
  });

  const boards = data;
  const isLoading = !data;
  const setBoards = mutate;

  return {
    boards,
    error,
    isLoading,
    setBoards
  };
};

const useBoards = ({ initialBoards }: any) => {
  const { boards, error, isLoading, setBoards } = useFetchedBoards(initialBoards);

  const createBoard = async () => {
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
      await setBoards();
    } catch (e) {
      alert(e.response.messages);
      console.log(e);
    }
  };

  return { boards, error, isLoading, setBoards, createBoard };
};

export default useBoards;
