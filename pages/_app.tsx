import { ThemeProvider } from '@emotion/react';
import axios from 'axios';
import { AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { ErrorBoundary } from '../components/templates';
import { APIErrorProvider, GlobalStyle, theme } from '../shared';
import { AuthProvider } from '../shared/hooks/useAuth';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
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
          <APIErrorProvider>
            <Component {...pageProps} />
            <ErrorBoundary />
          </APIErrorProvider>
        </ThemeProvider>
      </SWRConfig>
    </AuthProvider>
  );
};

export default App;
