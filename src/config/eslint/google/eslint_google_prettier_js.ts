/* eslint-disable prettier/prettier */
const esGoogleJsPretty = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'google',
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

export default esGoogleJsPretty;
