import { css, Global } from '@emotion/react';
import React from 'react';

export const GlobalStyle = (props: any) => (
  <Global
    {...props}
    styles={css`
      html {
        font-family: sans-serif;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        font-size: 62.5%;
      }
      body {
        margin: 0;
        font-family: 'Roboto', 'HelveticaNeue', 'Helvetica Neue', sans-serif;
      }
    `}
  />
);
