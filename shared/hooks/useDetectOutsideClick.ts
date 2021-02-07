import { RefObject, useEffect, useState } from 'react';

export const useDetectOutsideClick = (el: RefObject<HTMLUListElement | HTMLDivElement>, initialState = false) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      if (!el?.current?.contains(e.target as Node)) {
        setIsActive(!isActive);
      }
    };
    if (isActive) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isActive, el]);

  return [isActive, setIsActive] as const;
};
