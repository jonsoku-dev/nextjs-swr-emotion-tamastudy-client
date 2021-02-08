import { css, useTheme } from '@emotion/react';
import React from 'react';

interface Props {}

export const Label: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  return (
    <label
      css={css`
        display: flex;
        font-weight: 600;
        margin-bottom: ${theme.space}px;
        font-size: 1.6rem;
      `}>
      {children}
    </label>
  );
};
