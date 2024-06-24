// vitest.config.js

import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  testDir:"./tests/nuxt",
  test: {
    dir: './tests/nuxt',
    environment: 'nuxt',
    rootDir:"./tests/nuxt"
  }
});
