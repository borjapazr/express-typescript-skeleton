import { WinstonLogger } from '@infrastructure/shared/winston-logger';

const LOGGER = new WinstonLogger();

export { LOGGER };

export * from './domain.error';
export * from './logger.interface';
export * from './string.vo';
