import axios from 'axios';
import React, { useCallback, useContext, useState } from 'react';
import { Cookies } from 'react-cookie';
import useSWR, { cache } from 'swr';
import { mutateCallback } from 'swr/dist/types';

import { API_URL } from '../enums';
import { IUser, UserJoinForm, UserLoginForm } from '../types';

interface ContextInterface {
  token: string | null;
  isLoggedIn: boolean;
  auth: IUser | undefined;
  mutateAuth: (
    data?: IUser | Promise<IUser> | mutateCallback<IUser> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<IUser | undefined>;
  login: (form: UserLoginForm) => Promise<void>;
  join: (form: UserJoinForm) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthStateContext = React.createContext({} as ContextInterface);

const cookies = new Cookies();

export const AuthProvider: React.FC = ({ children }) => {
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
      onError() {
        clearAuth();
      }
    }
  );

  const login = useCallback(async (form: UserLoginForm) => {
    try {
      const response = await axios.post(API_URL.LOGIN, form);
      cookies.set('token', response.data.token);
      setToken(response.data.token);
    } catch (e) {
      clearAuth();
    }
  }, []);

  const join = useCallback(async (form: UserJoinForm) => {
    try {
      await axios.post(API_URL.JOIN, form);
    } catch (e) {
      clearAuth();
    }
  }, []);

  const logout = useCallback(async () => {
    clearAuth();
  }, []);

  const clearAuth = useCallback(() => {
    cookies.remove('token');
    cache.delete(API_URL.AUTHENTICATE);
    setToken(null);
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
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuth = (): ContextInterface => {
  return useContext(AuthStateContext);
};
