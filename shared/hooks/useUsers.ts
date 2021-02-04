import nookies from 'nookies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IUser } from '../apis';
import { JWT_TOKEN, USER_URI } from '../enums';
import axios from '../utils/axios';

const useUsers = (initialUser?: IUser | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => {
    setIsLoading(false);
  };

  const fetch = useCallback(async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${nookies.get().jwt}`
      }
    });
    return response.data as IUser;
  }, []);

  const { data, error, isValidating, mutate } = useSWR(USER_URI.GET_USER, fetch, {
    initialData: initialUser,
    onError: () => {
      nookies.destroy(null, JWT_TOKEN);
    }
  });

  useEffect(() => {
    if (isValidating) {
      setIsLoading(true);
      return;
    }
    setTimeout(loadingTimeout, 500);
  }, [isValidating]);

  const joinUser = useCallback(async () => {
    await axios.post(USER_URI.JOIN_USER, {
      username: 'jonsoku2',
      email: 'the2792@gmail.com',
      password: '1234'
    });
  }, [data, mutate]);

  const loginUser = useCallback(async () => {
    const res = await axios.post(USER_URI.LOGIN_USER, {
      email: 'the2792@gmail.com',
      password: '1234'
    });
    nookies.set(null, JWT_TOKEN, res.data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
    await mutate();
  }, [data, mutate]);

  const logoutUser = useCallback(async () => {
    await axios.get(USER_URI.LOGOUT_USER);
    nookies.destroy(null, JWT_TOKEN);
    await mutate(null);
  }, [data, mutate]);

  const memoizedData = useMemo(() => data, [data]);

  return {
    fetch: {
      user: memoizedData,
      error,
      isLoading,
      mutate,
      isLoggedIn: !!memoizedData
    },
    joinUser,
    loginUser,
    logoutUser
  };
};

export default useUsers;
