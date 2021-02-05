import { css, useTheme } from '@emotion/react';
import React, { ReactNode } from 'react';

import { Label } from '../../atoms';

interface Props {
  label: ReactNode;
  errors?: string;
}

export const FormItem: React.FC<Props> = ({ label, errors, children }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        margin: ${theme.space}px 0;
      `}>
      <Label>{label}</Label>
      {children}
      {errors && <p>{errors}</p>}
    </div>
  );
};
