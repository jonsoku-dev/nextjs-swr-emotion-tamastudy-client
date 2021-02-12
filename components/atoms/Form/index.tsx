import React, { FormHTMLAttributes } from 'react';

import { FlexBox } from '../FlexBox';

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  gap?: number;
}

export const Form: React.FC<Props> = ({ gap = 8, children, ...rest }) => {
  return (
    <FlexBox el={'form'} direction={'column'} gap={gap} {...rest}>
      {children}
    </FlexBox>
  );
};
