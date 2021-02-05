import { css, useTheme } from '@emotion/react';
import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: any;
}

export const TextInput: React.FC<Props> = ({ register, ...rest }) => {
  const theme = useTheme();
  return (
    <input
      type="text"
      ref={register}
      {...rest}
      css={css`
        width: 100%;
        display: flex;
        height: 32px;
        padding: ${theme.space / 2}px ${theme.space}px;
      `}
    />
  );
};
