import { css, useTheme } from '@emotion/react';
import React from 'react';

interface Props {}

export const HoverMenu: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  return (
    <li
      css={css`
        padding: ${theme.space}px;
      `}>
      {children}
    </li>
  );
};
