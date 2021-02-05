import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import { IUserContext } from '../../../shared/hooks/useUserContext';
import { Container } from '../../atoms';

interface Props extends IUserContext {
  title: string;
  children?: ReactNode;
}

export const Layout: React.FC<Props> = ({
  title = 'This is the default title',
  user,
  isLoggedIn,
  logoutUser,
  children
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Container>
          <nav>
            {isLoggedIn ? (
              <div>
                <h1
                  css={css`
                    background-color: red;
                  `}>
                  Hello {user?.username}
                </h1>
                <button onClick={() => logoutUser()}>Logout</button>
              </div>
            ) : (
              <>
                <Link href={'/login'}>
                  <a>Login To Continue</a>
                </Link>
                <Link href={'/join'}>
                  <a>Join Us</a>
                </Link>
              </>
            )}
          </nav>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>{' '}
            |
            <Link href="/board">
              <a>Board</a>
            </Link>{' '}
            |
          </nav>
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
