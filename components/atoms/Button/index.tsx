import { css, useTheme } from '@emotion/react';
import React, { ButtonHTMLAttributes } from 'react';
import * as ReactIcons from 'react-icons/ai';

interface IButtonColors {
  bg?: string;
  text?: string;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: any;
  colors?: IButtonColors;
  icon?: keyof typeof ReactIcons;
}

export const Button: React.FC<Props> = ({ onClick, colors, icon, children, ...rest }) => {
  const theme = useTheme();
  const IconWrapper = icon && ReactIcons[icon];
  return (
    <button
      css={css`
        display: inline-flex;
        gap: ${theme.space}px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: ${theme.space / 1.5}px ${theme.space}px;
        border-radius: 4px;
        transition: all 0.2s;
        text-transform: uppercase;
        border: 1px solid ${colors?.text ?? '#ffffff'};
        color: ${colors?.text ?? '#ffffff'};
        background: ${colors?.bg ?? '#454545'};
        outline: ${colors?.bg ?? '#454545'};
        font-size: 1rem;
        font-weight: 500;
        &:hover {
          border: 1px solid ${colors?.bg ?? '#454545'};
          color: ${colors?.bg ?? '#454545'};
          background: none;
        }
      `}
      onClick={onClick}
      {...rest}>
      {children}
      {IconWrapper && <IconWrapper size={'1.2rem'} />}
    </button>
  );
};
