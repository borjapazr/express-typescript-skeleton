import { PrismaClient } from '@prisma/client';
import { PlatformTest } from '@tsed/common';
import { IORedisTest } from '@tsed/ioredis';
import IORedis from 'ioredis';
import SuperTest from 'supertest';

import { bootstrap } from '@infrastructure/shared';
import { Server } from '@presentation/rest/server';

type SuperTestRequest = SuperTest.SuperTest<SuperTest.Test>;

const mockExternalDependencies = (): void => {
  jest.spyOn(PrismaClient.prototype, '$connect').mockImplementation(() => Promise.resolve());
  jest.spyOn(IORedis.prototype, 'connect').mockImplementation(() => Promise.resolve());
};

const TestServer = {
  bootstrap: async (): Promise<void> => {
    mockExternalDependencies();
    await bootstrap();
    IORedisTest.create();
    return PlatformTest.bootstrap(Server, { ...(await Server.getConfiguration()) })();
  },

  getSuperTestRequest: (): SuperTestRequest => {
    return SuperTest(PlatformTest.callback());
  },
  reset: async (): Promise<void> => {
    IORedisTest.reset();
    PlatformTest.reset();
  }
};

export { SuperTestRequest, TestServer };
