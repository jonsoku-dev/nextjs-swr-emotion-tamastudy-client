import nookies from 'nookies';
import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { IUser } from '../apis';
import { JWT_TOKEN, USER_URI } from '../enums';
import axios from '../utils/axios';

export interface IUserJoinRequestForm {
  email: string;
  password: string;
  username: string;
}
export interface IUserLoginRequestForm {
  email: string;
  password: string;
}

export interface IUserContext {
  user?: IUser | null;
  error: any;
  isLoading: boolean;
  mutate: any;
  isLoggedIn: boolean;
  joinUser: (form: IUserJoinRequestForm, onSuccess?: () => void, onError?: () => void) => Promise<void>;
  loginUser: (form: IUserLoginRequestForm, onSuccess?: () => void, onError?: () => void) => Promise<void>;
  logoutUser: (onSuccess?: () => void, onError?: () => void) => Promise<void>;
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
    const timer = setTimeout(loadingTimeout, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [isValidating]);

  const joinUser = useCallback(
    async (form: IUserJoinRequestForm, onSuccess?: () => void, onError?: () => void) => {
      try {
        await axios.post(USER_URI.JOIN_USER, form);
        if (onSuccess) {
          onSuccess();
        }
      } catch (e) {
        if (onError) {
          onError();
        }
        console.log(e);
        // TODO: 에러처리 State
      }
    },
    [data, mutate]
  );

  const loginUser = useCallback(
    async (form: IUserLoginRequestForm, onSuccess?: () => void, onError?: () => void) => {
      try {
        await axios.post(USER_URI.LOGIN_USER, form);
        await mutate();
        if (onSuccess) {
          onSuccess();
        }
      } catch (e) {
        console.log(e);
        if (onError) {
          onError();
        }
        // TODO: 에러처리 State
      }
    },
    [data, mutate]
  );

  const logoutUser = useCallback(
    async (onSuccess?: () => void, onError?: () => void) => {
      try {
        await axios.get(USER_URI.LOGOUT_USER);
        await mutate(null);
        onSuccess && onSuccess();
      } catch (e) {
        onError && onError();
        console.log(e);
        // TODO: 에러처리 State
      }
    },
    [data, mutate]
  );

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
