import { performance } from 'perf_hooks';

import { LOGGER } from '@domain/shared';

import { DiContainer } from './di/di-container';

interface BootstrapResult {
  bootstrapDuration: number;
}

const bootstrap = async (): Promise<BootstrapResult> => {
  const bootstrapStartTime = performance.now();

  LOGGER.info('Bootstrapping infrastructure...');

  LOGGER.info('Initializing DI container...');
  await DiContainer.initialize();
  LOGGER.info('DI container initialized!');

  const bootstrapEndTime = performance.now();
  const bootstrapDuration = Math.floor(bootstrapEndTime - bootstrapStartTime);

  LOGGER.info(`Infrastructure bootstrap took ${bootstrapDuration} ms!`);

  return { bootstrapDuration };
};

export { bootstrap, BootstrapResult };
