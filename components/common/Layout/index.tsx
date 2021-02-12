import Head from 'next/head';
import React from 'react';

import { Container } from '../../atoms';
import { Auth } from '../../organisms/Auth';
import { MainNav } from '../../organisms/MainNav';

interface Props {
  title?: string;
  isLoggedIn: boolean;
}

export const Layout: React.FC<Props> = ({ title = 'This is the default title', isLoggedIn, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Container>
          <Auth isLoggedIn={isLoggedIn} />
          <MainNav />
        </Container>
      </header>
      <Container el={'main'}>{children}</Container>
      <footer>
        <hr />
        <Container>
          <span>I&apos;m here to stay (Footer)</span>
        </Container>
      </footer>
    </div>
  );
};
