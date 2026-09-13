import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { createErrorBody } from '@ecommerce/contracts';
import type { AppConfig } from './config.js';
import { AppError, validationError } from './errors.js';

export interface BuildAppOptions {
  config: AppConfig;
  logger?: FastifyServerOptions['logger'];
}

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });

  app.addHook('onRequest', async (request) => {
    request.headers['x-request-id'] = randomUUID();
  });

  app.get('/health', async () => ({ status: 'ok', environment: options.config.NODE_ENV }));

  app.setNotFoundHandler((request, reply) => {
    const requestId = request.headers['x-request-id'] as string;
    return reply.status(404).send(createErrorBody('NOT_FOUND', 'Resource not found', requestId));
  });

  app.setErrorHandler((error, request, reply) => {
    const requestId = request.headers['x-request-id'] as string;

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(error.toResponse(requestId));
    }

    if (error instanceof ZodError) {
      return reply.status(400).send(validationError(requestId));
    }

    request.log.error({ requestId, errorCode: 'UNEXPECTED' }, 'Unexpected application error');
    return reply
      .status(500)
      .send(createErrorBody('INTERNAL_ERROR', 'An unexpected error occurred', requestId));
  });

  return app;
}
