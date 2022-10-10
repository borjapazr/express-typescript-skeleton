import 'reflect-metadata';
import 'source-map-support/register';

import { PlatformExpress } from '@tsed/platform-express';

import { LOGGER } from '@domain/shared';
import { bootstrap } from '@infrastructure/shared';
import { Server } from '@presentation/rest/server';

const start = async (): Promise<void> => {
  await bootstrap();

  const platform = await PlatformExpress.bootstrap(Server, { ...(await Server.getProviders()) });
  await platform.listen();

  process
    .on('SIGINT', () => {
      platform.stop();
      LOGGER.info('Server gracefully shut down!');
    })
    .on('unhandledRejection', error => {
      LOGGER.error(`uncaughtException captured: ${error}`);
    })
    .on('uncaughtException', error => {
      LOGGER.error(`uncaughtException captured: ${error}`);
    });
};
start();
