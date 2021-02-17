import { css, useTheme } from '@emotion/react';
import React from 'react';
import * as ReactIcons from 'react-icons/ai';

interface Props {
  icon: keyof typeof ReactIcons;
  color: string;
  onClick: () => void;
}

export const CircleIconButton: React.FC<Props> = ({ icon, color, onClick }) => {
  const theme = useTheme();
  const IconWrapper = ReactIcons[icon];
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      css={css`
        position: fixed;
        right: ${theme.space * 4}px;
        bottom: ${theme.space * 4}px;
        border-radius: 50%;
        cursor: pointer;
        background-color: ${color};
        width: 48px;
        height: 48px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      `}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex={0}>
      <IconWrapper size={'2.4rem'} color={'#ffffff'} />
    </div>
  );
};
