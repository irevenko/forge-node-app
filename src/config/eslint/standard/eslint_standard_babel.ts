/* eslint-disable prettier/prettier */
const esStandardBabel = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['standard', 'eslint:recommended', 'plugin:node/recommended'],
  parser: '@babel/eslint-parser',
  plugins: ['babel'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
  },
};

export default esStandardBabel;
