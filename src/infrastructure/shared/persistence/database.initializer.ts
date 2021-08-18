import path from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { LOGGER } from '@domain/shared';
import { DatabaseConfig, GlobalConfig } from '@infrastructure/shared/config/infrastructure.config';

class DatabaseInitializer {
  static readonly connectionOptions: ConnectionOptions = {
    type: DatabaseConfig.DB_TYPE,
    host: DatabaseConfig.DB_HOST,
    port: DatabaseConfig.DB_PORT,
    username: DatabaseConfig.DB_USER,
    password: DatabaseConfig.DB_PASSWORD,
    database: DatabaseConfig.DB_NAME,
    synchronize: true,
    connectTimeout: 300_000,
    logging: GlobalConfig.IS_DEVELOPMENT,
    entities: [path.join(__dirname, '../../**/*.entity.ts')],
    migrations: [path.join(__dirname, '../../shared/persistence/migrations/**/*.ts')],
    subscribers: [path.join(__dirname, '../../shared/persistence/subscribers/**/*.ts')],
    namingStrategy: new SnakeNamingStrategy()
  };

  static connection: Connection;

  static async initialize(): Promise<void> {
    try {
      DatabaseInitializer.connection = await createConnection(DatabaseInitializer.connectionOptions);
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }
}

export { DatabaseInitializer };
