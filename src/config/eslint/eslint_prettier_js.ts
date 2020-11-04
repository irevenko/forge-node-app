/* eslint-disable prettier/prettier */
const esjsPretty = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {}
}

export default esjsPretty;
