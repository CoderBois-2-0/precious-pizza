//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    // prettier and eslint config throws weird errors if not ignored
    ignores: ['./*.config.js'],
  },
];
