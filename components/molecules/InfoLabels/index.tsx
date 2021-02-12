import React from 'react';

import { FlexBox } from '../../atoms/FlexBox';
import { InfoLabel } from '../../atoms/InfoLabel';

interface InfoLabelType {
  label: string;
  value: string;
}

interface Props {
  items?: InfoLabelType[];
  gap?: number;
}

export const InfoLabels: React.FC<Props> = ({ items, ...rest }) => {
  if (!items) return null;
  return (
    <FlexBox direction={'column'} vertical={'flex-start'} {...rest}>
      {items.map(({ label, value }, idx) => (
        <InfoLabel key={idx} label={label} value={value} />
      ))}
    </FlexBox>
  );
};
