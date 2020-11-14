/* eslint-disable prettier/prettier */
const esAirBnbJsPretty = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
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

export default esAirBnbJsPretty;
