import { css } from '@emotion/react';
import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button: React.FC<Props> = ({ text, ...rest }) => {
  return (
    <button css={css``} {...rest}>
      {text}
    </button>
  );
};
