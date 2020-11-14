/* eslint-disable prettier/prettier */
const esStandardTsPretty = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {},
};

export default esStandardTsPretty;
