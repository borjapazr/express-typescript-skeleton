import { sync as readPackageJsonSync } from "read-pkg";

import {
  getEnvironmentNumber,
  getEnvironmentString,
} from "@infrastructure/shared/config/environment";

const AppInfo = {
  APP_VERSION: getEnvironmentString(
    "APP_VERSION",
    readPackageJsonSync().version
  ),
  APP_NAME: getEnvironmentString("APP_NAME", readPackageJsonSync().name),
  APP_DESCRIPTION: getEnvironmentString(
    "APP_DESCRIPTION",
    readPackageJsonSync().description || "N/A"
  ),
  AUTHOR_NAME: getEnvironmentString(
    "AUTHOR_NAME",
    readPackageJsonSync().author?.name || "N/A"
  ),
  AUTHOR_EMAIL: getEnvironmentString(
    "AUTHOR_EMAIL",
    readPackageJsonSync().author?.email || "N/A"
  ),
  AUTHOR_WEBSITE: getEnvironmentString(
    "AUTHOR_WEBSITE",
    readPackageJsonSync().author?.url || "N/A"
  ),
};

const AppConfig = {
  PORT: getEnvironmentNumber("PORT", 3000),
  BASE_PATH: getEnvironmentString("BASE_PATH", "/api"),
  JWT_SECRET: getEnvironmentString("JWT_SECRET", "jwtSecretPassphrase"),
  JWT_EXPIRATION: getEnvironmentNumber("JWT_EXPIRATION", 1),
  JWT_REFRESH_EXPIRATION: getEnvironmentNumber("JWT_REFRESH_EXPIRATION", 6),
};

export { AppConfig, AppInfo };
