import useSWR from 'swr';

import { BOARD_URL } from '../enums';

interface Props {
  initialBoards?: any;
}

export const useBoards = ({ initialBoards }: Props) => {
  const { data: boards, mutate: mutateBoards } = useSWR(BOARD_URL.BASE_BOARD, {
    initialData: initialBoards
  });
  return { boards, mutateBoards };
};
