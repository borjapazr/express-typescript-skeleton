import { performance } from 'node:perf_hooks';

import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';

import { Cache } from './cache/cache';
import { DependencyInjection } from './di/dependency-injection';

interface BootstrapResult {
  bootstrapDuration: number;
}

const bootstrap = async (): Promise<BootstrapResult> => {
  const decorateLoggerMessage = (message: string): string => {
    return `${emoji.get('zap')} ${message}`;
  };

  const bootstrapStartTime = performance.now();

  Logger.info(decorateLoggerMessage('Bootstrapping infrastructure...'));

  Logger.info(decorateLoggerMessage('Initializing DI container...'));

  await DependencyInjection.initialize();

  Logger.info(decorateLoggerMessage('DI container initialized!'));

  Logger.info(decorateLoggerMessage('Initializing cache...'));

  await Cache.initialize();

  Logger.info(decorateLoggerMessage('Cache initialized!'));

  const bootstrapEndTime = performance.now();

  const bootstrapDuration = bootstrapEndTime - bootstrapStartTime;

  Logger.info(decorateLoggerMessage(`Infrastructure bootstrap took +${bootstrapDuration} ms to execute!`));

  return { bootstrapDuration };
};

export { bootstrap, BootstrapResult };
