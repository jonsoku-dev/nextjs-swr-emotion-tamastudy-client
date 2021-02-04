export type ThemeType = typeof light; // This is the type definition for my theme object.

export const light = {
  primary: '#f45511',
  text: '#000',
  background: '#fff'
};

export const dark: ThemeType = {
  primary: '#222222',
  text: '#999',
  background: '#600099'
};

const theme = light; // set the light theme as the default.

export default theme;
