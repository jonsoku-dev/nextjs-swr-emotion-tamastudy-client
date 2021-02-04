import nookies from 'nookies';
import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IUser } from '../apis';
import { JWT_TOKEN, USER_URI } from '../enums';
import axios from '../utils/axios';

interface IUserJoinRequestForm {
  email: string;
  password: string;
  username: string;
}
interface IUserLoginRequestForm {
  email: string;
  password: string;
}

interface IUserContext {
  user?: IUser | null;
  error: any;
  isLoading: boolean;
  mutate: any;
  isLoggedIn: boolean;
  joinUser: (form: IUserJoinRequestForm) => Promise<void>;
  loginUser: (form: IUserLoginRequestForm) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface Props {
  initialUser?: IUser | null;
  children: any;
}

export const UserProvider: FC<Props> = ({ initialUser, children }) => {
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
      console.info('[AUTH_ERROR] 쿠키의 토큰을 삭제합니다!!');
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

  const joinUser = useCallback(
    async (form: IUserJoinRequestForm) => {
      try {
        await axios.post(USER_URI.JOIN_USER, form);
      } catch (e) {
        console.log(e);
        // TODO: 에러처리 State
      }
    },
    [data, mutate]
  );

  const loginUser = useCallback(
    async (form: IUserLoginRequestForm) => {
      try {
        await axios.post(USER_URI.LOGIN_USER, form);
        await mutate();
      } catch (e) {
        console.log(e);
        // TODO: 에러처리 State
      }
    },
    [data, mutate]
  );

  const logoutUser = useCallback(async () => {
    try {
      await axios.get(USER_URI.LOGOUT_USER);
      await mutate(null);
    } catch (e) {
      console.log(e);
      // TODO: 에러처리 State
    }
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
