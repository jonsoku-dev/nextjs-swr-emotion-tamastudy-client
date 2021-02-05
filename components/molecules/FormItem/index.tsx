import { css } from '@emotion/react';
import React, { ReactNode } from 'react';

import { Label } from '../../atoms';

interface Props {
  label: ReactNode;
  errors?: string;
}

export const FormItem: React.FC<Props> = ({ label, errors, children }) => {
  return (
    <div css={css``}>
      <Label>{label}</Label>
      {children}
      {errors && <p>{errors}</p>}
    </div>
  );
};
