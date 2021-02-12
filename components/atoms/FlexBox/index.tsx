import { css, CSSObject } from '@emotion/react';
import React, { ComponentType } from 'react';

interface Props {
  direction?: CSSObject['flexDirection'];
  vertical?: CSSObject['justifyContent'];
  horizontal?: CSSObject['justifyItems'];
  gap?: number;
  el?: ComponentType | keyof JSX.IntrinsicElements;
}

export const FlexBox: React.FC<Props> = ({
  direction = 'row',
  vertical = 'center',
  horizontal = 'center',
  el: Wrapper = 'div',
  gap = 0,
  children,
  ...rest
}) => {
  return (
    <Wrapper
      css={css`
        display: flex;
        flex-direction: ${direction};
        justify-content: ${vertical};
        justify-items: ${horizontal};
        gap: ${gap}px;
      `}
      {...rest}>
      {children}
    </Wrapper>
  );
};
