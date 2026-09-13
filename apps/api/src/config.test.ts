import { describe, expect, it } from 'vitest';
import { readConfig } from './config.js';

describe('readConfig', () => {
  it('uses safe development defaults', () => {
    expect(readConfig({})).toMatchObject({
      NODE_ENV: 'development',
      API_HOST: '127.0.0.1',
      API_PORT: 3000,
      CORS_ORIGIN: 'http://localhost:5173',
    });
  });

  it('rejects invalid port values', () => {
    expect(() => readConfig({ API_PORT: '0' })).toThrow();
  });
});
