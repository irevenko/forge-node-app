/* eslint-disable prettier/prettier */
const esStandardTs = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint'],
  rules: {},
};

export default esStandardTs;
