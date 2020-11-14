/* eslint-disable prettier/prettier */
const esGoogleTs = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'google',
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

export default esGoogleTs;
