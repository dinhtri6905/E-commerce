import { Role } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { withinTransaction } from './client.js';
import { classifyPersistenceError } from './errors.js';
import { cartRepository, orderRepository, productRepository } from './repositories.js';
import { createTestDatabase, resetTestDatabase } from './test/database.js';

const database = createTestDatabase();

type PersistenceFailure = ReturnType<typeof classifyPersistenceError>;

async function expectPersistenceFailure(
  operation: () => Promise<unknown>,
  expected: PersistenceFailure,
): Promise<void> {
  let failure: unknown;

  try {
    await operation();
  } catch (error) {
    failure = error;
  }

  expect(classifyPersistenceError(failure)).toBe(expected);
}

async function createCustomer(email: string) {
  return database.user.create({
    data: { email, passwordHash: 'argon2id-test-hash', role: Role.CUSTOMER },
  });
}

async function createCatalogItem() {
  const category = await database.category.create({ data: { name: 'Hardware' } });
  const product = await database.product.create({
    data: {
      categoryId: category.id,
      name: 'Keyboard',
      description: 'A mechanical keyboard',
      priceMinor: 12_500n,
    },
  });
  await database.inventory.create({ data: { productId: product.id, quantity: 5n } });
  return { category, product };
}

async function createPlacedOrder(userId: string, totalMinor = 1_000n) {
  return database.order.create({ data: { userId, totalMinor, status: 'PLACED' } });
}

describe('PostgreSQL persistence foundation', () => {
  beforeAll(async () => {
    await database.$connect();
  });

  beforeEach(async () => {
    await resetTestDatabase(database);
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('enforces normalized, cross-role-unique email identities', async () => {
    await createCustomer('customer@example.com');

    await expectPersistenceFailure(
      () =>
        database.user.create({
          data: {
            email: 'customer@example.com',
            passwordHash: 'argon2id-test-hash',
            role: Role.ADMIN,
          },
        }),
      'UNIQUE_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () =>
        database.user.create({
          data: {
            email: 'Customer@Example.com',
            passwordHash: 'argon2id-test-hash',
            role: Role.CUSTOMER,
          },
        }),
      'CHECK_CONSTRAINT',
    );
  });

  it('enforces lifecycle, USD money, quantity, and cart-line invariants', async () => {
    const customer = await createCustomer('cart-owner@example.com');
    const { category, product } = await createCatalogItem();
    const cart = await database.cart.create({ data: { userId: customer.id } });

    await expectPersistenceFailure(
      () =>
        database.inventory.update({ where: { productId: product.id }, data: { quantity: -1n } }),
      'CHECK_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () => database.product.update({ where: { id: product.id }, data: { priceMinor: 0n } }),
      'CHECK_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () =>
        database.cartItem.create({
          data: { cartId: cart.id, productId: product.id, quantity: 0n },
        }),
      'CHECK_CONSTRAINT',
    );
    await database.cartItem.create({
      data: { cartId: cart.id, productId: product.id, quantity: 1n },
    });
    await expectPersistenceFailure(
      () =>
        database.cartItem.create({
          data: { cartId: cart.id, productId: product.id, quantity: 1n },
        }),
      'UNIQUE_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () => database.category.delete({ where: { id: category.id } }),
      'FOREIGN_KEY_CONSTRAINT',
    );

    const deactivated = await database.product.update({
      where: { id: product.id },
      data: { isActive: false },
    });
    expect(deactivated.isActive).toBe(false);
    await expect(
      database.product.findUniqueOrThrow({ where: { id: product.id } }),
    ).resolves.toMatchObject({
      categoryId: category.id,
    });
  });

  it('enforces order snapshots, lifecycle timestamps, and idempotency state', async () => {
    const customer = await createCustomer('order-owner@example.com');
    const { product } = await createCatalogItem();
    const order = await createPlacedOrder(customer.id, 2_000n);

    await expectPersistenceFailure(
      () =>
        database.order.create({
          data: { userId: customer.id, totalMinor: 100n, status: 'PROCESSING' },
        }),
      'CHECK_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () =>
        database.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productNameSnapshot: 'Keyboard',
            unitPriceMinor: 1_000n,
            quantity: 2n,
            lineTotalMinor: 1_999n,
          },
        }),
      'CHECK_CONSTRAINT',
    );
    await expectPersistenceFailure(
      () =>
        database.checkoutIdempotency.create({
          data: {
            userId: customer.id,
            keyHmac: Buffer.from('test-hmac-1'),
            cartVersion: 0n,
            state: 'COMPLETED',
          },
        }),
      'CHECK_CONSTRAINT',
    );

    await database.checkoutIdempotency.create({
      data: {
        userId: customer.id,
        keyHmac: Buffer.from('test-hmac-2'),
        cartVersion: 0n,
        state: 'COMPLETED',
        orderId: order.id,
        completedAt: new Date(),
      },
    });
    await expectPersistenceFailure(
      () =>
        database.checkoutIdempotency.create({
          data: { userId: customer.id, keyHmac: Buffer.from('test-hmac-2'), cartVersion: 0n },
        }),
      'UNIQUE_CONSTRAINT',
    );
  });

  it('binds owner-scoped repository queries and stable order ordering', async () => {
    const firstCustomer = await createCustomer('first@example.com');
    const secondCustomer = await createCustomer('second@example.com');
    const { product } = await createCatalogItem();
    const firstCart = await database.cart.create({ data: { userId: firstCustomer.id } });
    await database.cart.create({ data: { userId: secondCustomer.id } });
    await database.cartItem.create({
      data: { cartId: firstCart.id, productId: product.id, quantity: 1n },
    });

    const olderOrder = await createPlacedOrder(firstCustomer.id);
    const newerOrder = await database.order.create({
      data: {
        userId: firstCustomer.id,
        totalMinor: 2_000n,
        createdAt: new Date(Date.now() + 1_000),
      },
    });
    await createPlacedOrder(secondCustomer.id);

    await expect(cartRepository.findForCustomer(database, firstCustomer.id)).resolves.toMatchObject(
      {
        id: firstCart.id,
        items: [{ productId: product.id }],
      },
    );
    await expect(
      cartRepository.findForCustomer(database, secondCustomer.id),
    ).resolves.toMatchObject({ items: [] });
    await expect(
      orderRepository.findForCustomer(database, secondCustomer.id, olderOrder.id),
    ).resolves.toBeNull();

    const firstPage = await orderRepository.listForCustomer(database, firstCustomer.id, {
      page: 1,
      pageSize: 1,
    });
    const secondPage = await orderRepository.listForCustomer(database, firstCustomer.id, {
      page: 2,
      pageSize: 1,
    });
    expect(firstPage.map((item) => item.id)).toEqual([newerOrder.id]);
    expect(secondPage.map((item) => item.id)).toEqual([olderOrder.id]);
    expect(() =>
      orderRepository.listForCustomer(database, firstCustomer.id, { page: 1, pageSize: 101 }),
    ).toThrow('Invalid page bounds.');
  });

  it('uses a parameter-bound, bounded search over active catalog data', async () => {
    const { product } = await createCatalogItem();

    await expect(
      productRepository.searchActive(database, 'MECHANICAL', { page: 1, pageSize: 20 }),
    ).resolves.toMatchObject([{ id: product.id }]);

    await database.product.update({ where: { id: product.id }, data: { isActive: false } });
    await expect(
      productRepository.searchActive(database, 'keyboard', { page: 1, pageSize: 20 }),
    ).resolves.toEqual([]);
  });

  it('rolls back a failed transaction and classifies database constraint failures', async () => {
    await expect(
      withinTransaction(database, async (transaction) => {
        await transaction.category.create({ data: { name: 'Rolled back' } });
        throw new Error('intentional test rollback');
      }),
    ).rejects.toThrow('intentional test rollback');
    expect(await database.category.count({ where: { name: 'Rolled back' } })).toBe(0);

    await expectPersistenceFailure(
      () => createCustomer('invalid-email@example.com '),
      'CHECK_CONSTRAINT',
    );
  });
});
