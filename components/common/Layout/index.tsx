import Head from 'next/head';
import React, { ReactNode } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import { IUserContext } from '../../../shared/hooks/useUserContext';
import { CLink, Container, FlexBox, Header } from '../../atoms';
import { Dropdown } from '../../molecules/Dropdown';

interface Props extends IUserContext {
  title: string;
  children?: ReactNode;
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
          <FlexBox el={'nav'} vertical={'flex-end'}>
            {isLoggedIn ? (
              <Dropdown button={<FaUserCircle size={'2rem'} />} menus={[{ text: 'logout', url: '/logout' }]} />
            ) : (
              <Dropdown
                button={<FaUserCircle size={'2rem'} />}
                menus={[
                  { text: 'login', url: '/login' },
                  { text: 'join', url: '/join' }
                ]}
              />
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
