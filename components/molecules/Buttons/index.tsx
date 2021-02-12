import { CSSObject } from '@emotion/react';
import React from 'react';

import { Button } from '../../atoms';
import { FlexBox } from '../../atoms/FlexBox';

interface ButtonColorsType {
  bg?: string;
  text?: string;
}

interface ButtonType {
  colors?: ButtonColorsType;
  onClick?: any;
  show?: boolean;
  text: string;
}

interface Props {
  items: ButtonType[];
  direction?: CSSObject['flexDirection'];
  vertical?: CSSObject['justifyContent'];
  horizontal?: CSSObject['justifyItems'];
  gap?: number;
}

export const Buttons: React.FC<Props> = ({ items, ...rest }) => {
  return (
    <FlexBox {...rest}>
      {items.map(
        ({ show = true, text, colors, onClick }, idx) =>
          show && <Button key={idx} colors={colors} onClick={onClick} text={text} />
      )}
    </FlexBox>
  );
};
