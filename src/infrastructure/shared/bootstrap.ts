import { performance } from 'perf_hooks';

import { Logger } from '@domain/shared';

import { DependencyInjection } from './di/dependency-injection';

interface BootstrapResult {
  bootstrapDuration: number;
}

const bootstrap = async (): Promise<BootstrapResult> => {
  const bootstrapStartTime = performance.now();

  Logger.info('Bootstrapping infrastructure...');

  Logger.info('Initializing DI container...');

  await DependencyInjection.initialize();

  Logger.info('DI container initialized!');

  const bootstrapEndTime = performance.now();

  const bootstrapDuration = bootstrapEndTime - bootstrapStartTime;

  Logger.info(`Infrastructure bootstrap took +${bootstrapDuration} ms to execute!`);

  return { bootstrapDuration };
};

export { bootstrap, BootstrapResult };
