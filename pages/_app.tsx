import { ThemeProvider } from '@emotion/react';
import axios from 'axios';
import { AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { ErrorBoundary } from '../components/templates';
import { APIErrorProvider, AuthProvider, GlobalStyle, theme } from '../shared';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <APIErrorProvider>
      <AuthProvider>
        {(token) => {
          if (token) {
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
          }
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
              <ThemeProvider theme={theme}>
                <GlobalStyle />
                <Component {...pageProps} />
                <ErrorBoundary />
              </ThemeProvider>
            </SWRConfig>
          );
        }}
      </AuthProvider>
    </APIErrorProvider>
  );
};

export default App;
