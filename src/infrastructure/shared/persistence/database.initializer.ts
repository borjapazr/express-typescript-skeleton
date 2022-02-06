import { LOGGER } from '@domain/shared';

const DatabaseInitializer = {
  async initialize(): Promise<void> {
    try {
      LOGGER.info('Initializing database connection...');
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }
};

export { DatabaseInitializer };
