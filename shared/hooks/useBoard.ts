import useSWR from 'swr';

import { getBoard } from '../apis';

const useFetchedBoard = (id: number | string) => {
  const { data, error, mutate } = useSWR('getBoard', getBoard(id));

  const board = data;
  const isLoading = !data;
  const setBoard = mutate;

  return {
    board,
    error,
    isLoading,
    setBoard
  };
};

const useBoard = (id: number | string) => {
  const { board, error, isLoading, setBoard } = useFetchedBoard(id);

  return { board, error, isLoading, setBoard };
};

export default useBoard;
