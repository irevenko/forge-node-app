/* eslint-disable prettier/prettier */
const esbabelPretty = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  parser: "@babel/eslint-parser",
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

export default esbabelPretty;
