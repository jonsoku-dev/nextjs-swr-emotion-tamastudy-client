import { css, useTheme } from '@emotion/react';
import Head from 'next/head';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FcReddit } from 'react-icons/fc';

import { CLink, Container, FlexBox, H4, Logo } from '../../atoms';
import { Dropdown } from '../../molecules/Dropdown';

interface Props {
  title?: string;
  isLoggedIn: boolean;
}

export const Layout: React.FC<Props> = ({ title = 'This is the default title', isLoggedIn, children }) => {
  const theme = useTheme();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Container>
          <FlexBox
            vertical={'space-between'}
            css={css`
              margin: ${theme.space * 2}px 0;
            `}>
            <Logo />
            {isLoggedIn ? (
              <Dropdown button={<FcReddit size={'3rem'} />} menus={[{ text: '로그아웃', url: '/logout' }]} />
            ) : (
              <Dropdown
                button={<FaUserCircle size={'3rem'} />}
                menus={[
                  { text: '로그인', url: '/login' },
                  { text: '회원가입', url: '/join' }
                ]}
              />
            )}
          </FlexBox>
          <FlexBox el={'nav'}>
            <CLink href={'/'}>
              <H4>HOME</H4>
            </CLink>
            <CLink
              href={{
                pathname: '/board'
              }}>
              <H4>BOARD</H4>
            </CLink>
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
