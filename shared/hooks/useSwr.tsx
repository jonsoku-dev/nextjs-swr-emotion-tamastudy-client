import { useEffect, useRef } from 'react';
import _useSwr, { cache } from 'swr';
import { ConfigInterface, keyInterface, responseInterface } from 'swr/dist/types';

/**
 * Patched version of SWR to work around the fact that initial data is not inserted to the cache.
 *
 * This is an issue when using useSWR with initialData and then calling mutate with a function that
 * expects the current value. Before the data is revalidated, the function passed to mutate will
 * receive undefined.
 *
 * Based on:
 * @see https://github.com/vercel/swr/issues/284#issuecomment-706094532
 */

export const useSwr = <Data, Error>(
  key: keyInterface,
  config?: ConfigInterface<Data, Error>
): responseInterface<Data, Error> => {
  const hasMounted = useRef(false);

  if (config?.initialData) {
    const [k] = cache.serializeKey(key);
    // Set initial data as cache value if:
    // initialData is set
    // it is the first render
    // and the cache value for this key is undefined
    if (!hasMounted.current && cache.get(k) === undefined) {
      cache.set(k, config?.initialData);
    }
  }

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return _useSwr<Data, Error>(key, config);
};
