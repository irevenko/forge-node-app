/* eslint-disable prettier/prettier */
const esStandardJsPretty = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};

export default esStandardJsPretty;
