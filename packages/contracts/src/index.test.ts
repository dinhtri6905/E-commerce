import { describe, expect, it } from 'vitest';
import { errorBodySchema, validationProbeSchema } from './index.js';

describe('shared contracts', () => {
  it('rejects unknown request fields', () => {
    expect(validationProbeSchema.safeParse({ value: 'valid', extra: true }).success).toBe(false);
  });

  it('accepts only allowlisted safe error output', () => {
    expect(
      errorBodySchema.safeParse({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request is invalid',
          requestId: '7a65f83a-13bc-49be-a69f-55e2e6f8f8fe',
        },
      }).success,
    ).toBe(true);
  });
});
