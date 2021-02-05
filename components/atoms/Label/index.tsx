import React from 'react';

interface Props {}

export const Label: React.FC<Props> = ({ children }) => {
  return <label>{children}</label>;
};
