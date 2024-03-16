import * as dotEnvConfig from 'dotenv-defaults/config';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotEnvConfig);

const getEnvironmentString = (key: string, defaultValue: string): string => {
  return process.env[String(key)] || defaultValue;
};

const getEnvironmentNumber = (key: string, defaultValue: number): number => {
  return Number(process.env[String(key)] || defaultValue);
};

export { getEnvironmentNumber, getEnvironmentString };
