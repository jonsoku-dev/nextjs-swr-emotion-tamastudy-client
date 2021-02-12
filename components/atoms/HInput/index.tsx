import { css, useTheme } from '@emotion/react';
import React from 'react';

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const HInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const theme = useTheme();
  return (
    <input
      ref={ref}
      css={css`
        width: 100%;
        display: flex;
        height: 32px;
        padding: ${theme.space / 2}px ${theme.space}px;
      `}
      {...props}
    />
  );
});

HInput.displayName = 'HInput';
