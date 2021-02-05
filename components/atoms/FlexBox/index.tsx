import { css, CSSObject } from '@emotion/react';
import React, { ComponentType } from 'react';

interface Props {
  direction?: CSSObject['flexDirection'];
  vertical?: CSSObject['justifyContent'];
  horizontal?: CSSObject['justifyItems'];
  el?: ComponentType | keyof JSX.IntrinsicElements;
}

export const FlexBox: React.FC<Props> = ({
  direction = 'row',
  vertical = 'center',
  horizontal = 'center',
  el: Wrapper = 'div',
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
      `}
      {...rest}>
      {children}
    </Wrapper>
  );
};
