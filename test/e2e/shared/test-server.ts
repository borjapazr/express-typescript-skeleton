import { PrismaClient } from '@prisma/client';
import { PlatformTest } from '@tsed/common';

import { Server } from '@presentation/rest/server';

const TestServer = {
  bootstrap: async (): Promise<void> => {
    jest.spyOn(PrismaClient.prototype, '$connect').mockImplementation(() => Promise.resolve());
    return PlatformTest.bootstrap(Server, { ...(await Server.getProviders()) })();
  }
};

export { TestServer };
