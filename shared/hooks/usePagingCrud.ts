import { isEmpty } from 'lodash';
import nookies from 'nookies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigInterface } from 'swr';
import useSWR from 'swr';

import { BasePaging } from '../apis/shared';
import axios from '../utils/axios';

const usePagingCrud = <ResponseType, CreateRequest, UpdateRequest>(
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
    setTimeout(loadingTimeout, 500);
  }, [isValidating]);

  const create = useCallback(
    async (createObject: CreateRequest) => {
      const response = await axios.post(url, createObject, {
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

  const update = useCallback(
    async (id: string | number, updateObject: UpdateRequest) => {
      const response = await axios.patch(`${url}/${id}`, updateObject, {
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

export default usePagingCrud;
