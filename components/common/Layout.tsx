import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import { useUserContext } from '../../shared/hooks/useUserContext';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const { user, isLoggedIn, logoutUser } = useUserContext();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          {isLoggedIn ? (
            <div>
              <h1
                css={css`
                  background-color: red;
                `}>
                Hello {user?.username}
              </h1>
              <button onClick={logoutUser}>Logout</button>
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
      </header>
      {children}
      <footer>
        <hr />
        <span>I&apos;m here to stay (Footer)</span>
      </footer>
    </div>
  );
};

export default Layout;
