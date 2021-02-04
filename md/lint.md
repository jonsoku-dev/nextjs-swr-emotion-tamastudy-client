# ESLint + Prettier + Husky
**for Next.js + Typescript**

## Installl
```bash
npm i -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-simple-import-sort
```  
- `eslint`: Eslint itself
- `prettier`: Prettier itself
- `eslint-plugin-react`: Eslint plugin for react
- `eslint-plugin-react-hooks`: Eslint plugin for react hooks, helps you write modern functional react components
- `eslint-config-prettier`: Eslint config for prettier, it will extend the style guide to match prettier
- `eslint-plugin-prettier`: Eslint plugin for prettier, it will raise eslint errors about formatting
- `eslint-plugin-jsx-a11y`: Eslint plugin to raise accessibility violation errors
- `@typescript-eslint/eslint-plugin`: For extending our rules to work with prettier
- `@typescript-eslint/parser`: To enable eslint to parse typescript code
- `eslint-plugin-simple-import-sort`: Do you find yourself worrying about the order of your import statements. Here's a solution to let eslint worry about all that.

## Settings
```bash
touch .eslintrc.js .prettierrc .eslintignore .prettierignore
```
### ignore files
```bash
node_modules
```

### .eslintrc.js
```js
'use strict';

module.exports = {
  plugins: ['simple-import-sort'],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    amd: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended' // Make sure this is always the last element in the array.
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton']
      }
    ]
  }
};
```
### .prettierrc
```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "none",
  "jsxBracketSameLine": true
}
```

## husky + lint-staged
```bash
npm i -D husky lint-staged
```
- husky: A tool for adding a pre-commit hook to git, It will run a certain command every time you commit
- lint-staged: A tool for running a certain list of commands over files that staged for committing in git

### add to package.json
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "./**/*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```

### husky가 잘 작동하지않을때는 아래와 같이 대처한다.
```bash
rm -rf node_modules
rm -rf .git/hooks
npm install
```