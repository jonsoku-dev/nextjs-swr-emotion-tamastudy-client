import axios, { AxiosResponse } from 'axios';
import Router from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { checkTokenExpired } from '../actions';
import { API_URL } from '../enums';
import { IUser, JoinRequest, LoginRequest, UserLoginResponse } from '../types';
import { IS_SERVER } from '../utils';
import { useAlertContext } from './useAlertContext';

interface ContextInterface {
  user: IUser;
  login: (form: LoginRequest) => Promise<void>;
  join: (form: JoinRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthStateContext = React.createContext({} as ContextInterface);

export const AuthProvider: React.FC = ({ children }) => {
  const { setError } = useAlertContext();
  const [user, setUser] = useState<IUser>({
    isLoggedIn: false,
    userId: null
  });

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
    axios.defaults.headers['Authorization'] = `Bearer ${res.data.token}`;
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      userId: res.data.id as number
    }));
  };

  const onClear = () => {
    localStorage.removeItem('token');
    axios.defaults.headers['Authorization'] = null;
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      userId: null
    }));
  };

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      function (config) {
        if (!IS_SERVER) {
          const token = localStorage.getItem('token');
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      async function (error) {
        return Promise.reject(error);
      }
    );

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
            onClear();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      // remove all intercepts when done
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <AuthStateContext.Provider
      value={{
        user,
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
