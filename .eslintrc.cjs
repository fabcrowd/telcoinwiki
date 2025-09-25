module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  ignorePatterns: ['dist', 'js', 'styles', 'assets', 'reference', 'node_modules', '*.config.cjs', '*.config.js'],
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly'
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript'
      ],
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['vite.config.ts', 'vitest.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint', 'import'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
      rules: {
        'import/no-unresolved': 'off'
      }
    },
    {
      files: ['scripts/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['scripts/**/*.js'],
      env: {
        node: true
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: ['eslint:recommended'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
