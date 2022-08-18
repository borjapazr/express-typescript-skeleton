import { getEnvironmentNumber, getEnvironmentString } from './environment';

const GlobalConfig = {
  ENVIRONMENT: getEnvironmentString('NODE_ENV', 'development'),
  IS_TEST: getEnvironmentString('NODE_ENV', 'development') === 'test',
  IS_DEVELOPMENT: getEnvironmentString('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvironmentString('NODE_ENV', 'development') === 'production',
  LOGS_FOLDER: getEnvironmentString('LOGS_FOLDER', 'logs')
};

const DatabaseConfig = {
  DB_TYPE: getEnvironmentString('DB_TYPE', 'mysql') as any,
  DB_HOST: getEnvironmentString('DB_HOST', 'localhost'),
  DB_PORT: getEnvironmentNumber('DB_PORT', 5306),
  DB_USER: getEnvironmentString('DB_USER', 'mars-user'),
  DB_PASSWORD: getEnvironmentString('DB_PASSWORD', 'mars-password'),
  DB_NAME: getEnvironmentString('DB_NAME', 'base-app')
};

export { DatabaseConfig, GlobalConfig };
