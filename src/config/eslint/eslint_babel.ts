/* eslint-disable prettier/prettier */
const esbabel = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
  },
  rules: {
    "eslint-disable-next-line node/no-unsupported-features/es-syntax": "0",
  },
};

export default esbabel;
