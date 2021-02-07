import { css } from '@emotion/react';
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
}

export const Dropdown: React.FC<Props> = ({ button, menus }) => {
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
            position: absolute;
            top: 0;
            right: 0;
          `}>
          {menus.map((menu, idx) => (
            <li key={idx}>
              <CLink href={menu.url}>{menu.text}</CLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
