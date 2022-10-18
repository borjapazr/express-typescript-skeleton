import { getEnvironmentNumber, getEnvironmentString } from './environment';

const GlobalConfig = {
  ENVIRONMENT: getEnvironmentString('NODE_ENV', 'development'),
  IS_TEST: getEnvironmentString('NODE_ENV', 'development') === 'test',
  IS_DEVELOPMENT: getEnvironmentString('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvironmentString('NODE_ENV', 'development') === 'production',
  LOGS_FOLDER: getEnvironmentString('LOGS_FOLDER', 'logs'),
  JWT_SECRET: getEnvironmentString('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnvironmentNumber('JWT_EXPIRATION', 1),
  JWT_REFRESH_EXPIRATION: getEnvironmentNumber('JWT_REFRESH_EXPIRATION', 6)
};

const DatabaseConfig = {
  DB_TYPE: getEnvironmentString('DB_TYPE', 'postgresql') as any,
  DB_HOST: getEnvironmentString('DB_HOST', 'localhost'),
  DB_PORT: getEnvironmentNumber('DB_PORT', 5432),
  DB_USER: getEnvironmentString('DB_USER', 'mars-user'),
  DB_PASSWORD: getEnvironmentString('DB_PASSWORD', 'mars-password'),
  DB_NAME: getEnvironmentString('DB_NAME', 'express-typescript-skeleton-db')
};

export { DatabaseConfig, GlobalConfig };
