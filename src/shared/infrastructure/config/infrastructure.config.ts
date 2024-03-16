import { getEnvironmentNumber, getEnvironmentString } from './environment';

const GlobalConfig = Object.freeze({
  ENVIRONMENT: getEnvironmentString('NODE_ENV', 'development'),
  IS_TEST: getEnvironmentString('NODE_ENV', 'development') === 'test',
  IS_DEVELOPMENT: getEnvironmentString('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvironmentString('NODE_ENV', 'development') === 'production',
  LOGS_ENABLED: getEnvironmentString('LOGS_ENABLED', 'true') === 'true',
  LOGS_FOLDER: getEnvironmentString('LOGS_FOLDER', 'logs'),
  JWT_SECRET: getEnvironmentString('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnvironmentNumber('JWT_EXPIRATION', 1),
  JWT_REFRESH_EXPIRATION: getEnvironmentNumber('JWT_REFRESH_EXPIRATION', 6),
  STORE_SESSIONS_IN_CACHE: getEnvironmentString('SESSIONS_STORAGE', 'cache') !== 'db',
  STORE_SESSIONS_IN_DB: getEnvironmentString('SESSIONS_STORAGE', 'cache') === 'db',
  PINO_LOGGER_KEY: 'pino-logger'
});

const DatabaseConfig = Object.freeze({
  DB_TYPE: getEnvironmentString('DB_TYPE', 'postgresql') as any,
  DB_HOST: getEnvironmentString('DB_HOST', 'localhost'),
  DB_PORT: getEnvironmentNumber('DB_PORT', 5432),
  DB_USER: getEnvironmentString('DB_USER', 'mars-user'),
  DB_PASSWORD: getEnvironmentString('DB_PASSWORD', 'mars-password'),
  DB_NAME: getEnvironmentString('DB_NAME', 'express-typescript-skeleton-postgres')
});

const CacheConfig = Object.freeze({
  CACHE_HOST: getEnvironmentString('CACHE_HOST', 'localhost'),
  CACHE_PORT: getEnvironmentNumber('CACHE_PORT', 6379),
  CACHE_PASSWORD: getEnvironmentString('CACHE_PASSWORD', 'mars-password'),
  CACHE_DB: getEnvironmentNumber('CACHE_DB', 0)
});

export { CacheConfig, DatabaseConfig, GlobalConfig };
