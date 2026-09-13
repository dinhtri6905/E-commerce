import { createDatabaseClient } from '../client.js';

function parseTestDatabaseName(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  const databaseName = decodeURIComponent(url.pathname.slice(1));

  if (!databaseName.endsWith('_test')) {
    throw new Error('TEST_DATABASE_URL must target a database ending in _test.');
  }

  return databaseName;
}

export function readTestDatabaseUrl(environment: NodeJS.ProcessEnv = process.env): string {
  if (environment.NODE_ENV !== 'test' || !environment.TEST_DATABASE_URL) {
    throw new Error('A TEST_DATABASE_URL is required for database tests.');
  }

  parseTestDatabaseName(environment.TEST_DATABASE_URL);
  return environment.TEST_DATABASE_URL;
}

export function createTestDatabase(): ReturnType<typeof createDatabaseClient> {
  return createDatabaseClient(readTestDatabaseUrl());
}

export async function resetTestDatabase(
  database: ReturnType<typeof createDatabaseClient>,
): Promise<void> {
  const expectedDatabaseName = parseTestDatabaseName(readTestDatabaseUrl());
  const result = await database.$queryRaw<Array<{ database_name: string }>>`
    SELECT current_database() AS database_name
  `;

  if (result[0]?.database_name !== expectedDatabaseName) {
    throw new Error('Refusing to reset an unexpected database.');
  }

  await database.checkoutIdempotency.deleteMany();
  await database.orderItem.deleteMany();
  await database.order.deleteMany();
  await database.cartItem.deleteMany();
  await database.cart.deleteMany();
  await database.inventory.deleteMany();
  await database.product.deleteMany();
  await database.category.deleteMany();
  await database.authSession.deleteMany();
  await database.user.deleteMany();
}
