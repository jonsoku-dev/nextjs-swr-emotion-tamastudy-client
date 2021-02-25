import { ThemeProvider } from '@emotion/react';
import axios from 'axios';
import { AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { ErrorBoundary } from '../components/templates';
import { APIErrorProvider, AuthProvider, GlobalStyle, IS_SERVER, theme } from '../shared';

axios.defaults.withCredentials = true;
axios.defaults.headers['Authorization'] = IS_SERVER ? null : `Bearer ${localStorage.getItem('token')}`;

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string, queries: any) => {
          const res = await axios.get(queries ? `${url}?${queries}` : url);
          return res.data;
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        refreshInterval: 0
        // revalidateOnMount: true
      }}>
      <APIErrorProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
            <ErrorBoundary />
          </ThemeProvider>
        </AuthProvider>
      </APIErrorProvider>
    </SWRConfig>
  );
};

export default App;
