import { ThemeProvider } from '@emotion/react';
import { AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { GlobalStyle } from '../shared/styles';
import theme from '../shared/styles/theme';
import fetcher from '../shared/utils/fetcher';

interface InitialProps {}

const App = ({ Component, pageProps }: AppProps & InitialProps) => {
  return (
    <SWRConfig
      value={{
        fetcher,
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

App.getInitialProps = async () =>
  // ctx: AppContext
  {
    return {};
  };

export default App;
