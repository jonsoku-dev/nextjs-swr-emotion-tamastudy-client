import { css } from '@emotion/react';
import React from 'react';
import * as ReactIcons from 'react-icons/ai';

import { FlexBox } from '../FlexBox';

interface Props {
  icon: keyof typeof ReactIcons;
  iconColor: string;
  content: any;
}

export const IconButton: React.FC<Props> = ({ icon, iconColor, content, ...rest }) => {
  const IconWrapper = ReactIcons[icon];
  return (
    <FlexBox
      gap={4}
      css={css`
        padding: 6px 8px;
        border: 1px solid #e6e6e6;
        color: #404040;
      `}
      {...rest}>
      <IconWrapper color={iconColor} />
      <span>{content}</span>
    </FlexBox>
  );
};
