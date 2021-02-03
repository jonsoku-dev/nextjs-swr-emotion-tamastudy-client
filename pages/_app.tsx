import { AppProps } from 'next/app';
import React, { FC } from 'react';
import { SWRConfig } from 'swr';

import fetcher from '../shared/utils/fetcher';
// import { wrapper } from '../state';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <SWRConfig
    value={{
      fetcher,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      onError: (error) => {
        if (error.status !== 403 && error.status !== 401) {
          console.log('auth error from swr config');
        }
      }
    }}>
    <Component {...pageProps} />
  </SWRConfig>
);

// export default wrapper.withRedux(App);
export default App;
