import { css } from '@emotion/react';
import React from 'react';

import { useAlertContext } from '../../../shared/hooks';

interface Props {}

export const ErrorBoundary: React.FC<Props> = () => {
  const { errors } = useAlertContext();

  if (errors.length === 0) return null;

  console.log(errors);

  return (
    <div
      css={css`
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      `}>
      {errors.map((err) => (
        <div
          key={err?.id}
          css={css`
            background-color: ${err.type === 'warn' ? 'yellow' : err.type === 'error' ? 'red' : 'skyblue'};
          `}>
          <p>{err.message}</p>
          <p>{err.status}</p>
        </div>
      ))}
    </div>
  );
};
