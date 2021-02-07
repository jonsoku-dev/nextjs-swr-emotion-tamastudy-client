import { css, useTheme } from '@emotion/react';
import React, { useCallback, useRef } from 'react';

import { useDetectOutsideClick } from '../../../shared/hooks';
import { CLink } from '../../atoms/CLink';

interface IMenu {
  text: string;
  url: string;
}

interface Props {
  button: any;
  menus: IMenu[];
  menuPosition?: 'left' | 'right';
  menuFontSize?: string;
}

export const Dropdown: React.FC<Props> = ({ button, menus, menuPosition = 'left', menuFontSize = '1.2rem' }) => {
  const theme = useTheme();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = useCallback(() => setIsActive(!isActive), [isActive]);
  return (
    <div
      css={css`
        position: relative;
      `}>
      <button
        css={css`
          border: none;
          background: none;
          outline: none;
          cursor: pointer;
        `}
        onClick={onClick}>
        {button}
      </button>
      {isActive && (
        <ul
          ref={dropdownRef}
          css={css`
            z-index: 1000;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid #e1e1e1;
            position: absolute;
            top: 100%;
            text-align: center;
            white-space: nowrap;
            width: max-content;
            ${menuPosition === 'left' ? 'left : 0' : 'right: 0'}
          `}>
          {menus.map((menu, idx) => (
            <li
              key={idx}
              css={css`
                background-color: #ffffff;
                padding: ${theme.space / 4}px ${theme.space / 2}px;
                &:not(:last-of-type) {
                  border-bottom: 1px solid #e1e1e1;
                }
                &:hover {
                  background-color: #e1e1e1;
                }
              `}>
              <CLink position={'center'} href={menu.url}>
                <span
                  css={css`
                    font-size: ${menuFontSize};
                  `}>
                  {menu.text}
                </span>
              </CLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
