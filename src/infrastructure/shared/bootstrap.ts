import { performance } from 'perf_hooks';

import { LOGGER } from '@domain/shared';

import { DatabaseInitializer } from './persistence/database.initializer';

interface BootstrapResult {
  bootstrapDuration: number;
}

const bootstrap = async (): Promise<BootstrapResult> => {
  const bootstrapStartTime = performance.now();

  LOGGER.info('Bootstrapping infrastructure...');

  LOGGER.info('Initializing database...');
  await DatabaseInitializer.initialize();
  LOGGER.info('Database initialized!');

  const bootstrapEndTime = performance.now();
  const bootstrapDuration = Math.floor(bootstrapEndTime - bootstrapStartTime);

  LOGGER.info(`Infrastructure bootstrap took ${bootstrapDuration} ms!`);

  return {
    bootstrapDuration
  };
};

export { bootstrap, BootstrapResult };
