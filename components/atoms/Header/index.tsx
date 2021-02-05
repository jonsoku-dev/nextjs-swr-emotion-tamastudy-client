import { css } from '@emotion/react';
import React from 'react';

interface Props {
  el?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Header: React.FC<Props> = ({ el: Wrapper = 'h1', children, ...rest }) => {
  return (
    <Wrapper css={css``} {...rest}>
      {children}
    </Wrapper>
  );
};
