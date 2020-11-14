/* eslint-disable prettier/prettier */
const esGoogleBabelPretty = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'google',
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  plugins: ['babel', 'prettier'],
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

export default esGoogleBabelPretty;
