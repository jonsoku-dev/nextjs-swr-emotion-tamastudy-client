import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { IUser, JoinRequest, LoginRequest, UserJoinResponse, UserLoginResponse } from '../types';
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
  const { setAlert } = useAlertContext();
  const [user, setUser] = useState<IUser>({
    isLoggedIn: false
  });

  const login = useCallback(
    async (form: LoginRequest) => {
      try {
        const { data } = await axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/login', form);
        setAlert({
          type: 'info',
          message: '로그인하였습니다.'
        });
        if (!IS_SERVER) {
          onLoginSuccess(data);
        }
      } catch (e) {
        setAlert({
          type: 'error',
          message: '로그인 에러입니다.'
        });
      }
    },
    [IS_SERVER]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/user/logout');
      setAlert({
        type: 'info',
        message: '로그아웃하였습니다.'
      });
      onLoginClear();
    } catch (e) {
      setAlert({
        type: 'error',
        message: '로그아웃 에러입니다.'
      });
    }
  }, [IS_SERVER]);

  const join = useCallback(async (form: JoinRequest) => {
    try {
      await axios.post<UserJoinResponse>("http://localhost:8080/api/v1/user/join'", form);
      setAlert({
        type: 'info',
        message: '회원가입하였습니다. '
      });
    } catch (e) {
      setAlert({
        type: 'error',
        message: '회원가입 에러입니다. '
      });
    }
  }, []);

  const onLoginSuccess = useCallback((data: UserLoginResponse) => {
    localStorage.setItem('token', data.token);
    axios.defaults.headers['Authorization'] = `Bearer ${data.token}`;
    setUser({
      isLoggedIn: true,
      userId: data.id as number
    });
  }, []);

  const onLoginClear = useCallback(() => {
    localStorage.removeItem('token');
    axios.defaults.headers['Authorization'] = null;
    setUser({
      isLoggedIn: false
    });
  }, []);

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
        /**
         * 1. access token 에러 (이상한토큰) → 401에러
         * 2. access token 만료 → 401에러
         * 3. refresh token 에러 (이상한토큰) → 403에러
         * 4. refresh token 만료 → 403에러
         */
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const { data } = await axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/refresh');
          onLoginSuccess(data);
          return axios(originalRequest);
        } else if (error.response?.status == 403) {
          onLoginClear();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [IS_SERVER]);

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
