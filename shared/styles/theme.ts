import { css } from '@emotion/react';

export type ThemeType = typeof light; // This is the type definition for my theme object.

export const light = {
  space: 8,
  primary: '#f45511',
  text: '#000',
  background: '#fff',
  typography: {
    h1: css`
      font-size: 2.4rem;
    `,
    h2: css`
      font-size: 2.2rem;
    `,
    h3: css`
      font-size: 2rem;
    `,
    h4: css`
      font-size: 1.8rem;
    `,
    h5: css`
      font-size: 1.6rem;
    `,
    h6: css`
      font-size: 1.4rem;
    `,
    subheading1: css`
      font-size: 1.2rem;
    `,
    subheading2: css`
      font-size: 1rem;
    `,
    body1: css`
      font-size: 1.2rem;
    `,
    body2: css`
      font-size: 1rem;
    `
  }
};

// export const dark: ThemeType = {
//   space: 8,
//   primary: '#222222',
//   text: '#999',
//   background: '#600099'
// };

const theme = light; // set the light theme as the default.

export default theme;
