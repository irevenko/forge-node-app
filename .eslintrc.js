module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    // 'plugin:node/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'prettier/prettier': 'error',
    'no-unused-expressions': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'prefer-default-export': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
};
