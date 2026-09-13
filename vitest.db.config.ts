import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const contractsSource = fileURLToPath(
  new URL('./packages/contracts/src/index.ts', import.meta.url),
);

export default defineConfig({
  resolve: { alias: { '@ecommerce/contracts': contractsSource } },
  test: {
    name: 'database',
    environment: 'node',
    include: ['apps/api/src/db/**/*.integration.test.ts'],
    testTimeout: 15_000,
  },
});
