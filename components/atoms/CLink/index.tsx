import { css, useTheme } from '@emotion/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface Props extends LinkProps {
  fontSize?: string;
  position?: 'left' | 'center' | 'right';
}

export const CLink: React.FC<Props> = ({ fontSize = '1.2rem', position = 'center', children, ...rest }) => {
  const theme = useTheme();
  return (
    <Link {...rest}>
      <a
        css={css`
          cursor: pointer;
          display: flex;
          justify-content: ${position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : position};
          align-items: center;
          padding: ${theme.space}px;
          ${fontSize && `font-size: ${fontSize}`};
        `}>
        {children}
      </a>
    </Link>
  );
};
