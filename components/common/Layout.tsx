import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode, useCallback } from 'react';

import { useUserContext } from '../../shared/hooks/useUserContext';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const { user, isLoggedIn, joinUser, loginUser, logoutUser } = useUserContext();

  const onClickJoinUser = useCallback(async () => {
    await joinUser({
      username: `test${Math.floor(Math.random() * 100) + 1}`,
      email: `the279${Math.floor(Math.random() * 100) + 1}@gmail.com`,
      password: '1234'
    });
  }, []);

  const onClickLoginUser = useCallback(async () => {
    await loginUser({
      email: 'the27926@gmail.com',
      password: '1234'
    });
  }, []);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <h1
            css={css`
              background-color: red;
            `}>
            Hello {user?.username}
          </h1>
          <button onClick={onClickJoinUser}>JOIN!!!</button>
          {isLoggedIn ? (
            <button onClick={logoutUser}>Logout</button>
          ) : (
            <button onClick={onClickLoginUser}>Login To Continue</button>
          )}
        </nav>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/about">
            <a>About</a>
          </Link>{' '}
          |{' '}
          <Link href="/users">
            <a>Users List</a>
          </Link>{' '}
          | <a href="/api/users">Users API</a>
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
