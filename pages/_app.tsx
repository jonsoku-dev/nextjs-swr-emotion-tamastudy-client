import { ThemeProvider } from '@emotion/react';
import { AppContext, AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { IUser } from '../shared/apis';
import { USER_URI } from '../shared/enums';
import { UserProvider } from '../shared/hooks';
import { GlobalStyle } from '../shared/styles';
import theme from '../shared/styles/theme';
import fetcher from '../shared/utils/fetcher';

export interface InitialUserProps {
  initialUser?: IUser | null;
}

interface AppPageProps extends InitialUserProps, AppProps {}

const App = ({ Component, pageProps, initialUser }: AppPageProps) => {
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
        <UserProvider initialUser={initialUser}>
          <Component initialUser={initialUser} {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </SWRConfig>
  );
};

App.getInitialProps = async (appCtx: AppContext) => {
  const token = appCtx.ctx.req?.headers?.cookie?.split('=')[1] ?? null;
  const getUser = await fetch(USER_URI.GET_USER, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return {
    initialUser: getUser.ok ? await getUser.json() : null
  };
};

export default App;
