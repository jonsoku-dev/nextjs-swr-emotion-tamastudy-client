import { isEmpty } from 'lodash';
import nookies from 'nookies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigInterface } from 'swr';
import useSWR from 'swr';

import { BasePaging } from '../apis/shared';
import axios from '../utils/axios';

export const usePagingCrud = <ResponseType, CreateRequest, UpdateRequest>(
  url: string,
  // key?: keyof ResponseType,
  initialData: BasePaging<ResponseType> | null,
  fetchOptions?: ConfigInterface
) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => {
    setIsLoading(false);
  };
  const fetch = useCallback(async (url: string) => {
    const response = await axios.get(url);
    return response.data as BasePaging<ResponseType>;
  }, []);

  const { data, error, isValidating, mutate } = useSWR<BasePaging<ResponseType>>(url, fetch, {
    ...fetchOptions,
    initialData: initialData ?? undefined
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

  const create = useCallback(
    async (createObject: CreateRequest, onSuccess?: () => void, onError?: () => void) => {
      try {
        const response = await axios.post(url, createObject);
        const result = response.data as ResponseType;
        await mutate();
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (e) {
        console.log(e);
        if (onError) {
          onError();
        }
      }
    },
    [url, data, mutate]
  );

  const update = useCallback(
    async (id: string | number, updateObject: UpdateRequest) => {
      const response = await axios.patch(`${url}/${id}`, updateObject);
      const result = response.data as ResponseType;
      await mutate();
      return result;
    },
    [url, data, mutate]
  );

  const remove = useCallback(
    async (id: string | number) => {
      const response = await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${nookies.get(null).jwt}`
        }
      });
      const result = response.data as ResponseType;
      await mutate();
      return result;
    },
    [url, data, mutate]
  );

  const memoizedData = useMemo(() => (!isEmpty(data) ? data : ({} as BasePaging<ResponseType>)), [data]);

  return {
    fetch: {
      data: memoizedData,
      error,
      isLoading,
      mutate
    },
    create,
    update,
    remove
  };
};
