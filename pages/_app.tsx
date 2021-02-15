import { ThemeProvider } from '@emotion/react';
import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { SWRConfig } from 'swr';

import { ErrorBoundary, Layout } from '../components/templates';
import { APIErrorProvider, Axios, GlobalStyle, IS_SERVER, JWT_TOKEN, theme, useUser } from '../shared';

interface InitialProps {}

const App = ({ Component, pageProps }: AppProps & InitialProps) => {
  const { user } = useUser({});

  useEffect(() => {
    if (!IS_SERVER) {
      localStorage.setItem(JWT_TOKEN, user.token || '');
    }
  }, [IS_SERVER, user]);

  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          return await Axios.get(url);
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        refreshInterval: 0
      }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <APIErrorProvider>
          <Layout isLoggedIn={user.isLoggedIn}>
            <Component {...pageProps} />
          </Layout>
          <ErrorBoundary />
        </APIErrorProvider>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
