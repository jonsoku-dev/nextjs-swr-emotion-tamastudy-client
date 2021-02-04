# Emotion + Typescript

## Install
```bash
npm install @emotion/react @emotion/styled && npm install --save-dev @emotion/babel-preset-css-prop 
```

## .babelrc
```json
{
  "presets": [
    [
      "next/babel",
      {
        "preset-react": {
          "runtime": "automatic",
          "importSource": "@emotion/react"
        }
      }
    ]
  ],
  "plugins": ["@emotion/babel-plugin"]
}
```
## emotion
### **ThemeType**

테마는 여기에 정의
```ts
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

```
### **emotion.d.ts**

theme 부분을 declare 한다.
```ts
import '@emotion/react';

import { ThemeType } from './shared/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
```