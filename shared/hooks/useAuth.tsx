import axios, { AxiosResponse } from 'axios';
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import Router from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { mutateCallback } from 'swr/dist/types';

import fetchJson from '../../lib/fetchJson';
import { checkTokenExpired } from '../actions';
import { API_URL } from '../enums';
import { IUser, JoinRequest, LoginRequest, UserLoginResponse } from '../types';
import { IS_SERVER } from '../utils';
import { useAlertContext } from './useAlertContext';

interface ContextInterface {
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

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState((!IS_SERVER && localStorage.getItem('token')) || null);
  const { setError } = useAlertContext();
  const { data: auth, mutate: mutateAuth } = useSWR<IUser>(
    ['http://localhost:8080/api/v1/user/authenticate', token],
    (url: string, token: string | null) => {
      return axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => res.data);
    }
  );

  const login = useCallback(async (form: LoginRequest) => {
    try {
      const res = await axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/login', form);
      if (!IS_SERVER) {
        onLoginSuccess(res);
      }
    } catch (error) {
      console.log(error);
      setError({ message: '로그인 에러입니다.', status: error.response?.status, type: 'error' });
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/refresh');
      if (!IS_SERVER) {
        onLoginSuccess(res);
      }
    } catch (error) {
      console.log(error);
      setError({ message: 'Token refresh 에러입니다.', status: error.response?.status, type: 'error' });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post<void>('http://localhost:8080/api/v1/user/logout');
      if (!IS_SERVER) {
        onClear();
      }
      Router.push('/');
    } catch (error) {
      setError({ message: '로그아웃 에러입니다.', status: error.response?.status, type: 'error' });
    }
  }, []);

  const join = useCallback(async (form: JoinRequest) => {
    try {
      await axios.post<void>(API_URL.JOIN, form);
      Router.push('/login');
    } catch (error) {
      setError({ message: '회원가입 에러입니다.', status: error.response?.status, type: 'error' });
    }
  }, []);

  const onLoginSuccess = (res: AxiosResponse<UserLoginResponse>) => {
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    axios.defaults.headers['Authorization'] = `Bearer ${res.data.token}`;
  };

  const onLoginSuccess2 = (data: UserLoginResponse) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    axios.defaults.headers['Authorization'] = `Bearer ${data.token}`;
  };

  const onClear = () => {
    localStorage.removeItem('token');
    setToken('');
    axios.defaults.headers['Authorization'] = null;
  };

  useEffect(() => {
    const resInterceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
          if (error.response.data.message === 'Unauthorized') {
            if (!IS_SERVER) {
              const token = localStorage.getItem('token');
              if (token) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                if (checkTokenExpired(token)) {
                  console.log(':(');
                  return axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/refresh').then((res) => {
                    onLoginSuccess(res);
                    return axios(originalRequest); // retry
                  });
                }
              }
            }
          } else {
            console.log('????');
            onClear();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      // remove all intercepts when done
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [token, auth]);

  return (
    <AuthStateContext.Provider
      value={{
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
