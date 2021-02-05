import { css, useTheme } from '@emotion/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface Props extends LinkProps {}

export const CLink: React.FC<Props> = ({ children, ...rest }) => {
  const theme = useTheme();
  return (
    <Link {...rest}>
      <a
        css={css`
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${theme.space}px;
        `}>
        {children}
      </a>
    </Link>
  );
};
