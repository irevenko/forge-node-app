/* eslint-disable prettier/prettier */
const esStandardJs = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['standard', 'eslint:recommended', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};

export default esStandardJs;
