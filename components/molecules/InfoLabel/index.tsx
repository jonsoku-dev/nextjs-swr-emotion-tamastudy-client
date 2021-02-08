import { css, useTheme } from '@emotion/react';
import React from 'react';

import { Body2 } from '../../atoms';

interface Props {
  label: string;
  value: string;
}

export const InfoLabel: React.FC<Props> = ({ label, value }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: inline-flex;
        & span:not(:first-of-type) {
          margin-left: ${theme.space}px;
        }
        & span:not(:last-of-type) {
          margin-right: ${theme.space}px;
        }
      `}>
      <Body2
        el={'span'}
        css={css`
          color: #353535;
        `}>
        {label}
      </Body2>
      <Body2
        css={css`
          color: #353535;
        `}>
        ㅣ
      </Body2>
      <Body2 el={'span'}>{value}</Body2>
    </div>
  );
};
