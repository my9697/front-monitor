module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  extends: ['standard-with-typescript', 'prettier', "eslint:recommended",
  "plugin:@typescript-eslint/recommended"],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },

  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-new': 'off',
    'spaced-comment':'off',
    '@typescript-eslint/unbound-method':'off',
    '@typescript-eslint/explicit-function-return-type':'off',
    '@typescript-eslint/no-explicit-any':'off'
  },
};