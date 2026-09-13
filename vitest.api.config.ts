import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const contractsSource = fileURLToPath(
  new URL('./packages/contracts/src/index.ts', import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: {
      '@ecommerce/contracts': contractsSource,
    },
  },
  test: {
    name: 'api',
    environment: 'node',
    include: ['apps/api/src/**/*.test.ts'],
    exclude: ['apps/api/src/**/*.integration.test.ts'],
  },
});
