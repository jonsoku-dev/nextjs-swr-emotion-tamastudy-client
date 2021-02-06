import React, { ComponentType } from 'react';

export interface DynamicComponentProps {
  el?: ComponentType | keyof JSX.IntrinsicElements;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ el: Wrapper = 'div', children, ...rest }) => {
  return <Wrapper {...rest}>{children}</Wrapper>;
};
