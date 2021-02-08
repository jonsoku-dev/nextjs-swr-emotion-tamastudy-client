import { css, useTheme } from '@emotion/react';
import React, { ButtonHTMLAttributes } from 'react';

interface IButtonColors {
  bg: string;
  text: string;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: any;
  colors?: IButtonColors;
}

export const Button: React.FC<Props> = ({ text, onClick, colors, ...rest }) => {
  const theme = useTheme();
  return (
    <button
      css={css`
        cursor: pointer;
        padding: ${theme.space}px ${theme.space}px;
        border-radius: 4px;
        transition: all 0.2s;
        text-transform: uppercase;
        border: 1px solid ${colors?.text ?? 'white'};
        color: ${colors?.text ?? 'white'};
        background: ${colors?.bg ?? 'black'};
        outline: ${colors?.bg ?? 'black'};
        &:hover {
          border: 1px solid ${colors?.bg ?? 'black'};
          color: ${colors?.bg ?? 'black'};
          background: none;
        }
      `}
      onClick={onClick}
      {...rest}>
      {text}
    </button>
  );
};
