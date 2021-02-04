import nookies from 'nookies';
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IUser } from '../apis';
import { JWT_TOKEN, USER_URI } from '../enums';
import axios from '../utils/axios';

interface IUserContext {
  user: IUser | null;
  error: any;
  isLoading: boolean;
  mutate: any;
  isLoggedIn: boolean;
  joinUser: () => void;
  loginUser: () => void;
  logoutUser: () => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider: FC<any> = ({ initialUser, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => {
    setIsLoading(false);
  };

  const fetch = useCallback(async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${nookies.get(null)[JWT_TOKEN]}`
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
    await axios.post(USER_URI.LOGIN_USER, {
      email: 'the2792@gmail.com',
      password: '1234'
    });
    await mutate();
  }, [data, mutate]);

  const logoutUser = useCallback(async () => {
    await axios.get(USER_URI.LOGOUT_USER);
    await mutate(null);
  }, [data, mutate]);

  const memoizedData = useMemo(() => data, [data]);

  return (
    <UserContext.Provider
      value={{
        user: memoizedData,
        error,
        isLoading,
        mutate,
        isLoggedIn: !!memoizedData,
        joinUser,
        loginUser,
        logoutUser
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
