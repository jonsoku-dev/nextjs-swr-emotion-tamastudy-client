import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IBoard } from '../apis';
import { BasePaging } from '../apis/shared';
import { BOARD_URI } from '../enums';

export const useBoards = (initialData?: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => {
    setIsLoading(false);
  };

  const { data, error, isValidating, mutate } = useSWR<BasePaging<IBoard>>(BOARD_URI.BASE, {
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

  const memoizedData = useMemo(() => (!isEmpty(data) ? data : ({} as BasePaging<IBoard>)), [data]);

  return {
    data: memoizedData,
    error,
    isLoading,
    mutate
  };
};
