/* eslint-disable hexagonal-architecture/enforce */
import { WinstonLogger } from '@infrastructure/shared/winston-logger';

const LOGGER = new WinstonLogger();

export { LOGGER };

export * from './domain-service.decorator';
export * from './logger';
export * from './types';
