import { css, useTheme } from '@emotion/react';
import React from 'react';
import { FiMonitor } from 'react-icons/fi';

import { CLink } from '../CLink';
import { H1 } from '../Typography';

interface Props {}

export const Logo: React.FC<Props> = () => {
  const theme = useTheme();
  return (
    <CLink href={'/'}>
      <H1
        css={css`
          font-family: 'Do Hyeon', serif;
          margin-right: ${theme.space / 2}px;
        `}>
        아이니티
      </H1>
      <FiMonitor size={'2.4rem'} />
    </CLink>
  );
};
