import type { DatabaseClient } from './client.js';

export interface PageInput {
  page: number;
  pageSize: number;
}

function toBoundedPage({ page, pageSize }: PageInput): { skip: number; take: number } {
  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(pageSize) ||
    page < 1 ||
    pageSize < 1 ||
    pageSize > 100
  ) {
    throw new RangeError('Invalid page bounds.');
  }

  const skip = (page - 1) * pageSize;
  if (!Number.isSafeInteger(skip)) {
    throw new RangeError('Invalid page bounds.');
  }

  return { skip, take: pageSize };
}

export const userRepository = {
  findById(client: DatabaseClient, userId: string) {
    return client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};

export const cartRepository = {
  findForCustomer(client: DatabaseClient, userId: string) {
    return client.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  },
};

export const productRepository = {
  searchActive(client: DatabaseClient, searchTerm: string, page: PageInput) {
    const pagination = toBoundedPage(page);

    return client.product.findMany({
      where: {
        isActive: true,
        category: { isActive: true },
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...pagination,
    });
  },
};

export const orderRepository = {
  findForCustomer(client: DatabaseClient, userId: string, orderId: string) {
    return client.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { orderBy: { id: 'asc' } } },
    });
  },

  listForCustomer(client: DatabaseClient, userId: string, page: PageInput) {
    const pagination = toBoundedPage(page);

    return client.order.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...pagination,
    });
  },
};

export const checkoutIdempotencyRepository = {
  findForCustomer(client: DatabaseClient, userId: string, keyHmac: Uint8Array) {
    return client.checkoutIdempotency.findUnique({
      where: { userId_keyHmac: { userId, keyHmac } },
    });
  },
};
