import 'reflect-metadata';
import 'source-map-support/register';

import cookieParser from 'cookie-parser';
import endent from 'endent';
import express, { Application } from 'express';
import figlet from 'figlet';
import helmet from 'helmet';
import gracefulShutdown from 'http-graceful-shutdown';
import path from 'path';
import { useExpressServer } from 'routing-controllers';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { LOGGER } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';

import { checkRole, checkUser } from './authentication';
import { AppConfig, AppInfo } from './config/app.config';
import { AuthenticationController } from './controllers/authentication';
import { HealthController } from './controllers/health';
import { ErrorHandlerMiddleware, MorganMiddleware, NotFoundMiddleware } from './middlewares';

class App {
  public app: Application;

  public name: string;

  public port: number;

  public basePath: string;

  public env: string;

  constructor() {
    this.app = express();
    this.name = AppInfo.APP_NAME;
    this.port = AppConfig.PORT;
    this.basePath = AppConfig.BASE_PATH;
    this.env = GlobalConfig.ENVIRONMENT;

    this.initializeExternalMiddlewares();
    this.initializeSwagger();
    this.initializeApplication();
  }

  public start(): void {
    const server = this.app.listen(this.port, () => this.showBanner());

    gracefulShutdown(server, {
      finally: () => {
        LOGGER.info('Server gracefully shut down!');
      }
    });
  }

  public getServer(): Application {
    return this.app;
  }

  private initializeExternalMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
  }

  private initializeSwagger(): void {
    const swaggerDefinition = {
      openapi: '3.0.3',
      info: {
        title: this.name,
        version: AppInfo.APP_VERSION,
        description: AppInfo.APP_DESCRIPTION,
        license: {
          name: 'Licensed Under MIT',
          url: 'https://spdx.org/licenses/MIT.html'
        },
        contact: {
          name: AppInfo.AUTHOR_NAME,
          email: AppInfo.AUTHOR_EMAIL,
          url: AppInfo.AUTHOR_WEBSITE
        }
      },
      servers: [{ url: this.basePath }]
    };

    const jsDocumentOptions = {
      swaggerDefinition,
      apis: [path.join(__dirname, './**/*oas.yml')]
    };

    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: `${this.name} - OAS3`
    };

    const swaggerSpec = swaggerJSDoc(jsDocumentOptions);
    this.app.use(
      `${this.basePath}/spec`,
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerSpec, swaggerUiOptions)
    );
  }

  private initializeApplication(): void {
    useExpressServer(this.app, {
      routePrefix: this.basePath,
      controllers: [AuthenticationController, HealthController],
      middlewares: [MorganMiddleware, NotFoundMiddleware, ErrorHandlerMiddleware],
      authorizationChecker: checkRole,
      currentUserChecker: checkUser,
      defaultErrorHandler: false
    });
  }

  private showBanner(): void {
    const banner = endent`Application started successfully!
      ${figlet.textSync(this.name)}
       Name: ${this.name}
       Description: ${AppInfo.APP_DESCRIPTION}
       Version: ${AppInfo.APP_VERSION}
       Port: ${this.port}
       Base Path: ${this.basePath}
       Environment: ${this.env}
       Author: ${AppInfo.AUTHOR_NAME}
       Email: ${AppInfo.AUTHOR_EMAIL}
       Website: ${AppInfo.AUTHOR_WEBSITE}
       Copyright © ${new Date().getFullYear()} ${AppInfo.AUTHOR_EMAIL}. All rights reserved.
    `;
    LOGGER.info(banner);
  }
}

export { App };
