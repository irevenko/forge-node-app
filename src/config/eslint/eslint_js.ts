/* eslint-disable prettier/prettier */
const esjs = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};

export default esjs;
