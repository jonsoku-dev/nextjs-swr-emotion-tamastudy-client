import { css, useTheme } from '@emotion/react';
import React, { ReactNode } from 'react';

import { Body2, FlexBox, Label } from '../../atoms';

interface Props {
  label?: ReactNode;
  errors?: string;
}

export const FormItem: React.FC<Props> = ({ label, errors, children, ...rest }) => {
  const theme = useTheme();
  return (
    <FlexBox direction={'column'} gap={4} {...rest}>
      {label && <Label>{label}</Label>}
      {children}
      {errors && (
        <Body2
          el={'p'}
          css={css`
            font-weight: 700;
            color: ${theme.lightRed};
          `}>
          {errors}
        </Body2>
      )}
    </FlexBox>
  );
};
