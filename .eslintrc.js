module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/array-type': 'warn',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'import/order': [
            'error',
            {
                pathGroups: [
                  {
                    pattern: '@env',
                    group: 'internal',
                    position: 'after',
                  },
                  {
                    pattern: '@+(apps|api|libs)/**',
                    group: 'internal',
                    position: 'after',
                  },
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
                    caseInsensitive: true /* ignore case. Options: [true, false] */,
                },
                pathGroupsExcludedImportTypes: ['builtin'],
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
            },
        ],
        'eqeqeq': 'off',
        'import/no-named-as-default': 'off',
        'import/no-unresolved': 'off',
        'lines-between-class-members': [
            'error',
            'always',
            {
                'exceptAfterSingleLine': true
            }
        ],
        'max-len': ['error', { code: 100, ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
        'no-implicit-coercion': ['error', { allow: ['!!'] }],
        'no-negated-condition': 'off',
        'prettier/prettier': ['error', { printWidth: 100, endOfLine: "auto" }],
        // 'quotes': ['warn', 'single', { 'avoidEscape': true }],
    },
};

