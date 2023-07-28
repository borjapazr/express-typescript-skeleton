/**
 * Health check to verify if the service is alive.
 */

import * as http from 'node:http';

import { AppConfig } from '@presentation/rest/config';

const options = {
  host: 'localhost',
  port: AppConfig.PORT,
  timeout: 2000,
  path: `${AppConfig.BASE_PATH}/healthz`
};

const request = http.request(options, (response: http.IncomingMessage) => {
  process.exitCode = response.statusCode === 200 ? 0 : 1;
  process.exit();
});

request.on('error', () => {
  process.exit(1);
});

request.end();
