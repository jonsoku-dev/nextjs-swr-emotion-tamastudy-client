import { css } from '@emotion/react';
import { ReactNode } from 'react';

interface Props<O> {
  register: any;
  options?: O[];
  name: string;
  value: keyof O;
  text: keyof O;
  defaultValue?: any;
}

export const Select = <O extends { [key: string]: any }>({
  register,
  options,
  name,
  value,
  text,
  defaultValue,
  ...rest
}: Props<O> & { children?: ReactNode }) => {
  if (!options) {
    return null;
  }
  return (
    <select name={name} ref={register} css={css``} defaultValue={defaultValue} {...rest}>
      {options?.map((op) => (
        <option key={op[value]} value={op[value]}>
          {op[text]}
        </option>
      ))}
    </select>
  );
};
