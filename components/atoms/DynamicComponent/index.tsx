import { SerializedStyles } from '@emotion/react';
import React, { ComponentType } from 'react';

export interface DynamicComponentProps {
  css?: SerializedStyles;
  el?: ComponentType | keyof JSX.IntrinsicElements;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ css, el: Wrapper = 'div', children, ...rest }) => {
  return (
    <Wrapper css={css} {...rest}>
      {children}
    </Wrapper>
  );
};
