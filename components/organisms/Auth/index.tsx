import { css, useTheme } from '@emotion/react';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FcReddit } from 'react-icons/fc';

import { FlexBox } from '../../atoms/FlexBox';
import { Logo } from '../../atoms/Logo';
import { Dropdown } from '../../molecules/Dropdown';

interface Props {
  isLoggedIn: boolean;
}

export const Auth: React.FC<Props> = ({ isLoggedIn }) => {
  const theme = useTheme();
  return (
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
  );
};
