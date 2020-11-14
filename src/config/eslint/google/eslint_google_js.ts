/* eslint-disable prettier/prettier */
const esGoogleJs = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['google', 'eslint:recommended', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};

export default esGoogleJs;
