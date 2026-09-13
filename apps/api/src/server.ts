import { buildApp } from './app.js';
import { readConfig } from './config.js';

const config = readConfig();
const app = buildApp({ config, logger: true });

try {
  await app.listen({ host: config.API_HOST, port: config.API_PORT });
} catch {
  app.log.error({ errorCode: 'STARTUP_FAILED' }, 'API startup failed');
  process.exitCode = 1;
  await app.close();
}
