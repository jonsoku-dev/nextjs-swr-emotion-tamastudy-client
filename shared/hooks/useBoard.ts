import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IBoard } from '../apis';
import { BOARD_URI } from '../enums';

export const useBoard = (id: number | string, initialData?: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => {
    setIsLoading(false);
  };

  const { data, error, isValidating, mutate } = useSWR<IBoard>(`${BOARD_URI.BASE}/${id}`, {
    dedupingInterval: 1500,
    initialData
  });

  useEffect(() => {
    if (isValidating) {
      setIsLoading(true);
      return;
    }
    const timer = setTimeout(loadingTimeout, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [isValidating]);

  const memoizedData = useMemo(() => (!isEmpty(data) ? data : ({} as IBoard)), [data]);

  return {
    data: memoizedData,
    error,
    isLoading,
    mutate
  };
};
