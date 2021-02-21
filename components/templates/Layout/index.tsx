import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FcReddit } from 'react-icons/fc';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Container, FlexBox, Logo } from '../../atoms';
import { Dropdown } from '../../molecules/Dropdown';

interface Props {
  title?: string;
  isLoggedIn: boolean;
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export const Layout: React.FC<Props> = ({
  title = 'This is the default title',
  isLoggedIn,
  redirectTo,
  redirectIfFound,
  children
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!redirectTo) return;

    if ((redirectTo && !redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, redirectIfFound, redirectTo]);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header
        css={css`
          background-color: #242424;
          margin-bottom: 16px;
        `}>
        <Container>
          <FlexBox vertical={'space-between'}>
            {isLoggedIn ? (
              <Dropdown
                menuPosition={'left'}
                button={<FcReddit size={'3rem'} />}
                menus={[{ text: '로그아웃', url: '/logout' }]}
              />
            ) : (
              <Dropdown
                menuPosition={'right'}
                button={<FaUserCircle size={'3rem'} />}
                menus={[
                  { text: '로그인', url: '/login' },
                  { text: '회원가입', url: '/join' }
                ]}
              />
            )}
            <Logo />
            <Dropdown button={<GiHamburgerMenu size={'2.4rem'} />} menus={[{ text: '게시판', url: '/board' }]} />
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
