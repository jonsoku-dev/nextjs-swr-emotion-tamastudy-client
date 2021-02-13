import { ThemeProvider } from '@emotion/react';
import { AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import useUser from '../shared/hooks/useUser';
import { GlobalStyle } from '../shared/styles';
import theme from '../shared/styles/theme';
import axios from '../shared/utils/axios';

interface InitialProps {}

const App = ({ Component, pageProps }: AppProps & InitialProps) => {
  const { user } = useUser({});
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          });
          return res.data;
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        refreshInterval: 0
      }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
