import { css, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import React from 'react';

export const GlobalStyle = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
      ${emotionReset}
      *, *::after, *::before {
        box-sizing: border-box;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
      }
      html {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        font-size: 62.5%;
      }
      body {
        margin: 0;
        font-family: 'Roboto', 'HelveticaNeue', 'Helvetica Neue', sans-serif;
        background-color: #f2f2f2;
      }
    `}
  />
);
