import { css, useTheme } from '@emotion/react';
import React from 'react';

interface Props {}

export const Tag: React.FC<Props> = ({ children, ...rest }) => {
  const theme = useTheme();
  return (
    <span
      css={css`
        border: 1px solid #e1e1e1;
        padding: ${theme.space / 2}px ${theme.space}px;
        border-radius: 20px;
        background-color: #f6f6f6;
        font-size: 1rem;
        outline: none;
      `}
      {...rest}>
      {children}
    </span>
  );
};
