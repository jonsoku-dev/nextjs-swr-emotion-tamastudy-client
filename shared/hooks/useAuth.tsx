import axios from 'axios';
import Router from 'next/router';
import React, { useCallback, useContext, useState } from 'react';
import { Cookies } from 'react-cookie';
import useSWR, { cache } from 'swr';
import { mutateCallback } from 'swr/dist/types';

import { API_URL } from '../enums';
import { IUser, JoinRequest, LoginRequest, LoginResponse } from '../types';
import { useAlertContext } from './useAlertContext';

interface ContextInterface {
  token: string | null;
  isLoggedIn: boolean;
  auth: IUser | undefined;
  mutateAuth: (
    data?: IUser | Promise<IUser> | mutateCallback<IUser> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<IUser | undefined>;
  login: (form: LoginRequest) => Promise<void>;
  join: (form: JoinRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthStateContext = React.createContext({} as ContextInterface);

const cookies = new Cookies();

export const AuthProvider = ({ children }: { children: (token: string | null) => React.ReactNode }) => {
  const { setError } = useAlertContext();
  const [token, setToken] = useState<string | null>(cookies.get('token') ?? null);
  const { data: auth, mutate: mutateAuth } = useSWR<IUser>(
    token ? API_URL.AUTHENTICATE : null,
    (url) =>
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => res.data),
    {
      onError(error) {
        setError({ message: '인증 에러입니다.', status: error.response?.status, type: 'error' });
        clearAuth();
      }
    }
  );

  const login = useCallback(async (form: LoginRequest) => {
    try {
      const response = await axios.post<LoginResponse>(API_URL.LOGIN, form);
      cookies.set('token', response.data.token);
      setToken(response.data.token);
      Router.push('/');
    } catch (error) {
      setError({ message: '로그인 에러입니다.', status: error.response?.status, type: 'error' });
      clearAuth();
    }
  }, []);

  const join = useCallback(async (form: JoinRequest) => {
    try {
      await axios.post<void>(API_URL.JOIN, form);
      Router.push('/login');
    } catch (error) {
      setError({ message: '회원가입 에러입니다.', status: error.response?.status, type: 'error' });
      clearAuth();
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      clearAuth();
    }
  }, [auth]);

  const clearAuth = useCallback(() => {
    cache.delete(API_URL.AUTHENTICATE);
    cookies.remove('token');
    setToken(null);
    delete axios.defaults.headers['Authorization'];
  }, []);

  return (
    <AuthStateContext.Provider
      value={{
        token,
        isLoggedIn: !!auth,
        auth,
        mutateAuth,
        login,
        join,
        logout
      }}>
      {children(token)}
    </AuthStateContext.Provider>
  );
};

export const useAuth = (): ContextInterface => {
  return useContext(AuthStateContext);
};
