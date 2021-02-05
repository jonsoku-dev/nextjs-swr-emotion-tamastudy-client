import Head from 'next/head';
import React, { ReactNode } from 'react';

import { IUserContext } from '../../../shared/hooks/useUserContext';
import { CLink, Container, FlexBox, Header } from '../../atoms';

interface Props extends IUserContext {
  title: string;
  children?: ReactNode;
}

export const Layout: React.FC<Props> = ({ title = 'This is the default title', user, isLoggedIn, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Container>
          <FlexBox el={'nav'} vertical={'flex-end'}>
            {isLoggedIn ? (
              <>
                <span>Hello {user?.username}</span>
                <CLink href={'/logout'}>Logout</CLink>
                {/*<Button onClick={() => logoutUser()} text={'Logout'} />*/}
              </>
            ) : (
              <>
                <CLink href={'/login'}>Login</CLink>
                <CLink href={'/join'}>Join Us</CLink>
              </>
            )}
          </FlexBox>
          <FlexBox>
            <Header>Hello World!</Header>
          </FlexBox>
          <FlexBox el={'nav'}>
            <CLink href={'/'}>Home</CLink>
            <CLink href={'/board'}>Board</CLink>
          </FlexBox>
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
