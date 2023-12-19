module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
    // @see: https://github.com/typescript-eslint/typescript-eslint/issues/1824
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    'import/order': 'error',
    'no-plusplus': 'off',
    'node/no-missing-import': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
  },
};
