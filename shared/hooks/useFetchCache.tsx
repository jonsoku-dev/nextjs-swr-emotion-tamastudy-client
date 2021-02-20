import { useEffect } from 'react';
import useSWR, { cache, ConfigInterface, keyInterface, mutate, responseInterface } from 'swr';

export const useFetchCache: UseFetchCacheType = (key, fetchFunction, config) => {
  const response = useSWR(key, fetchFunction, config);
  const initialData = config?.initialData;

  useEffect(() => {
    if (!initialData) {
      mutate(key);
      return;
    }

    cache.set(key, initialData);
  }, [initialData]);

  return response;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

type UseFetchCacheType<Data = any, Error = any> = (
  key: keyInterface,
  fetchFunction?: FetcherFunctionType<Data>,
  config?: ConfigInterface<Data, Error>
) => responseInterface<Data, Error>;

type FetcherFunctionType<Data> = ((...args: any) => Data | Promise<Data>) | null;
