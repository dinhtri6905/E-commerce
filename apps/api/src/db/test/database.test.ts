import { describe, expect, it } from 'vitest';
import { readTestDatabaseUrl } from './database.js';

describe('readTestDatabaseUrl', () => {
  it('accepts only an explicit disposable test database URL', () => {
    expect(
      readTestDatabaseUrl({
        NODE_ENV: 'test',
        TEST_DATABASE_URL: 'postgresql://user:password@localhost:5432/ecommerce_test',
      }),
    ).toContain('ecommerce_test');
  });

  it('rejects a runtime database URL and a non-test database name', () => {
    expect(() => readTestDatabaseUrl({ NODE_ENV: 'test' })).toThrow('TEST_DATABASE_URL');
    expect(() =>
      readTestDatabaseUrl({
        NODE_ENV: 'test',
        TEST_DATABASE_URL: 'postgresql://user:password@localhost:5432/ecommerce',
      }),
    ).toThrow('ending in _test');
  });
});
