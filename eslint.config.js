const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  // Frontend constraints
  {
    // Feature libraries can depend on both core and data-access
    files: ['libs/frontend/feature/*/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['@typescript-exercise/frontend/core', '@typescript-exercise/frontend/data-access'],
          depConstraints: [
            {
              sourceTag: 'frontend',
              onlyDependOnLibsWithTags: ['frontend'],
            },
          ],
        },
      ],
    },
  },
  {
    // Data-access can't depend on anything
    files: ['libs/frontend/data-access/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'frontend',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
  {
    // Core can only depend on data-access
    files: ['libs/frontend/core/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['@typescript-exercise/frontend/data-access'],
          depConstraints: [
            {
              sourceTag: 'frontend',
              onlyDependOnLibsWithTags: ['frontend'],
            },
          ],
        },
      ],
    },
  },
  {
    // Frontend app can only depend on frontend tagged libraries
    files: ['frontend/*/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'frontend',
              onlyDependOnLibsWithTags: ['frontend'],
            },
          ],
        },
      ],
    },
  },
  // Backend constraints
  {
    // Feature libraries can depend on both core and data-access
    files: ['libs/backend/feature/*/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['@typescript-exercise/backend/core', '@typescript-exercise/backend/data-access'],
          depConstraints: [
            {
              sourceTag: 'backend',
              onlyDependOnLibsWithTags: ['backend'],
            },
          ],
        },
      ],
    },
  },
  {
    // Data-access can't depend on anything
    files: ['libs/backend/data-access/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'backend',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
  {
    // Core can only depend on data-access
    files: ['libs/backend/core/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['@typescript-exercise/backend/data-access'],
          depConstraints: [
            {
              sourceTag: 'backend',
              onlyDependOnLibsWithTags: ['backend'],
            },
          ],
        },
      ],
    },
  },
  {
    // Backend app can only depend on backend tagged libraries
    files: ['backend/*/**/*.ts'],
    rules: {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'backend',
              onlyDependOnLibsWithTags: ['backend'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
];
