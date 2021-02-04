import { AppContext, AppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

import { IUser } from '../shared/apis';
import { USER_URI } from '../shared/enums';
import useUsers from '../shared/hooks/useUsers';
import fetcher from '../shared/utils/fetcher';

// import { wrapper } from '../state';

export interface InitialUserProps {
  initialUser?: IUser | null;
}

interface AppPageProps extends InitialUserProps, AppProps {}

const App = ({ Component, pageProps, initialUser }: AppPageProps) => {
  useUsers(initialUser); // authenticate user
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        refreshInterval: 0,
        onError: (error) => {
          if (error.status !== 403 && error.status !== 401) {
            console.log('auth error from swr config');
          }
        }
      }}>
      <Component initialUser={initialUser} {...pageProps} />
    </SWRConfig>
  );
};

App.getInitialProps = async (appCtx: AppContext) => {
  const token = appCtx.ctx.req?.headers?.cookie?.split('=')[1];
  const getUser = await fetch(USER_URI.GET_USER, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return {
    initialUser: getUser.ok ? await getUser.json() : null
  };
};

// export default wrapper.withRedux(App);
export default App;
