import { registerConnectionProvider } from '@tsed/ioredis';
import Redis from 'ioredis';

import { Logger } from '@domain/shared';

const REDIS_CONNECTION = Symbol.for('REDIS_CONNECTION');
type RedisConnection = Redis;

class Cache {
  public static initialize = async (): Promise<void> => {
    try {
      registerConnectionProvider({
        provide: REDIS_CONNECTION,
        name: 'default'
      });
    } catch (error) {
      Logger.error(`[@Bootstrap] ${this.constructor.name}.initialize() threw the following error! --- ${error}`);
      process.exit(1);
    }
  };
}

export { Cache, REDIS_CONNECTION, RedisConnection };
