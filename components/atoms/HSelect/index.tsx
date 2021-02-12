import React from 'react';

type Option = {
  label: React.ReactNode;
  value: string | number | string[];
  id: string | number;
};

type SelectProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
  options?: Option[];
};

export const HSelect = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, ...props }, ref) => {
  if (!options) return null;
  return (
    <select ref={ref} {...props}>
      {options.map(({ label, value, id }) => (
        <option key={id} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

HSelect.displayName = 'HSelect';
