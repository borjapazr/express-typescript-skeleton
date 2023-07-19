import '@tsed/platform-express';
import '@tsed/swagger';
import '@tsed/ajv';
import './filters';

import { PlatformApplication } from '@tsed/common';
import { importProviders } from '@tsed/components-scan';
import { Inject } from '@tsed/di';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import endent from 'endent';
import express from 'express';
import figlet from 'figlet';
import methodOverride from 'method-override';
import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';
import { CacheConfig, GlobalConfig } from '@infrastructure/shared/config';

import { AppConfig, AppInfo } from './config';
import { ErrorHandlerMiddleware, LoggerMiddleware, MetadataMiddleware, NotFoundMiddleware } from './middlewares';

class Server {
  @Inject()
  private app: PlatformApplication;

  public static async getConfiguration(): Promise<Partial<TsED.Configuration>> {
    const baseConfiguration: Partial<TsED.Configuration> = {
      rootDir: __dirname,
      acceptMimes: ['application/json'],
      httpPort: AppConfig.PORT,
      httpsPort: false
    };

    const providersConfiguration: Partial<TsED.Configuration> = await importProviders({
      mount: {
        [AppConfig.BASE_PATH]: [`${__dirname}/controllers/**/*.controller.ts`]
      },
      imports: [
        `${__dirname}/../../infrastructure/**/*.domain-service.ts`,
        `${__dirname}/../../infrastructure/**/*.repository.ts`
      ]
    });

    const swaggerConfiguration: Partial<TsED.Configuration> = {
      swagger: [
        {
          path: `${AppConfig.BASE_PATH}/docs`,
          specVersion: '3.0.3',
          spec: {
            info: {
              title: AppInfo.APP_NAME,
              description: AppInfo.APP_DESCRIPTION,
              version: AppInfo.APP_VERSION,
              contact: {
                name: AppInfo.AUTHOR_NAME,
                email: AppInfo.AUTHOR_EMAIL,
                url: AppInfo.AUTHOR_WEBSITE
              },
              license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html'
              }
            },
            components: {
              securitySchemes: {
                Bearer: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                  description: endent`A valid *Access Token* is required to access protected resources. To obtain one, simply authenticate to the API through the authentication endpoint. If the authentication is successful, an Access Token and a Refresh Token will be returned.
              \n
              The *Access Token* can be attached to requests using one of the headers \`Authorization: Bearer <access_token>\` and \`access-token: <access-token>\` or a cookie called \`access-token\`.
              \n
              The *Refresh Token* can be sent using the header \`refresh-token: <refresh-token>\` or the cookie \`refresh-token\`.
              \n
              🧐 *The headers override the cookies, so if both are sent, the value of the headers will be used. In the case of the Access Token, the header with the highest priority is the one corresponding to the Authorization Bearer scheme.*
              \n
              **Sample username and password to use on \`/api/auth/login\` endpoint**: \`janedoe\` / \`123456\``
                }
              }
            }
          }
        }
      ]
    };

    const ioredisConfiguration: Partial<TsED.Configuration> = {
      ioredis: [
        {
          name: 'default',
          cache: false,
          host: CacheConfig.CACHE_HOST,
          port: CacheConfig.CACHE_PORT,
          password: CacheConfig.CACHE_PASSWORD,
          db: CacheConfig.CACHE_DB
        }
      ]
    };

    const loggerConfiguration: Partial<TsED.Configuration> = {
      logger: {
        level: 'off',
        disableRoutesSummary: true,
        logRequest: true
      }
    };

    return {
      ...baseConfiguration,
      ...providersConfiguration,
      ...swaggerConfiguration,
      ...ioredisConfiguration,
      ...loggerConfiguration
    };
  }

  public $beforeRoutesInit(): void | Promise<any> {
    this.app
      .use(cors())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(cookieParser())
      .use(compression({}))
      .use(methodOverride())
      .use(MetadataMiddleware)
      .use(LoggerMiddleware);
  }

  public $afterRoutesInit(): void {
    this.app.use(NotFoundMiddleware).use(ErrorHandlerMiddleware);
  }

  public $onReady(): void {
    if (!GlobalConfig.IS_TEST) {
      this.showBanner();
    }
  }

  private showBanner(): void {
    const banner = endent`${emoji.get('zap')} Application started successfully!
      ${figlet.textSync(AppInfo.APP_NAME)}
       Name: ${AppInfo.APP_NAME}
       Description: ${AppInfo.APP_DESCRIPTION}
       Version: ${AppInfo.APP_VERSION}
       Port: ${AppConfig.PORT}
       Base Path: ${AppConfig.BASE_PATH}
       OpenApi Spec Path: ${AppConfig.BASE_PATH}/docs
       Environment: ${GlobalConfig.ENVIRONMENT}
       Author: ${AppInfo.AUTHOR_NAME}
       Email: ${AppInfo.AUTHOR_EMAIL}
       Website: ${AppInfo.AUTHOR_WEBSITE}
       Copyright © ${new Date().getFullYear()} ${AppInfo.AUTHOR_EMAIL}. All rights reserved.
    `;
    Logger.info(banner);
  }
}

export { Server };
