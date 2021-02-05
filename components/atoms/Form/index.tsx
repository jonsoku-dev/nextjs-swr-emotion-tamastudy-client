import { css } from '@emotion/react';
import React, { FormHTMLAttributes } from 'react';

interface Props extends FormHTMLAttributes<HTMLFormElement> {}

export const Form: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <form css={css``} {...rest}>
      {children}
    </form>
  );
};
