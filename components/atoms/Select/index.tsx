import { css, useTheme } from '@emotion/react';
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
  const theme = useTheme();
  if (!options) {
    return null;
  }
  return (
    <select
      name={name}
      ref={register}
      css={css`
        padding: ${theme.space / 2}px ${theme.space}px ${theme.space / 2}px ${theme.space - 2}px;
      `}
      defaultValue={defaultValue}
      {...rest}>
      {options?.map((op) => (
        <option key={op[value]} value={op[value]}>
          {op[text]}
        </option>
      ))}
    </select>
  );
};
