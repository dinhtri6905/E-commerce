import { Prisma } from '@prisma/client';

export type PersistenceFailure =
  'UNIQUE_CONSTRAINT' | 'FOREIGN_KEY_CONSTRAINT' | 'CHECK_CONSTRAINT' | 'UNKNOWN';

export function classifyPersistenceError(error: unknown): PersistenceFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return 'UNIQUE_CONSTRAINT';
      case 'P2003':
        return 'FOREIGN_KEY_CONSTRAINT';
      case 'P2004':
        return 'CHECK_CONSTRAINT';
      default:
        return 'UNKNOWN';
    }
  }

  if (
    error instanceof Prisma.PrismaClientUnknownRequestError &&
    error.message.includes('violates check constraint')
  ) {
    return 'CHECK_CONSTRAINT';
  }

  return 'UNKNOWN';
}
