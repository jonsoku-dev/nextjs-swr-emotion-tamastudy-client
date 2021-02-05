import { css } from '@emotion/react';
import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register: any;
}

export const TextInput: React.FC<Props> = ({ register, ...rest }) => {
  return <input type="text" ref={register} {...rest} css={css``} />;
};
