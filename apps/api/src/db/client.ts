import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export function createDatabaseClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

export async function withinTransaction<T>(
  client: PrismaClient,
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return client.$transaction(operation);
}
