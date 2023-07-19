import { getContext } from '@tsed/di';
import { NextFunction, Request, Response } from 'express';
import pino, { Level, Logger as PinoLoggerType, TransportTargetOptions } from 'pino';
import pinoHttp from 'pino-http';

import { LoggerDomainService } from '@domain/shared/services';
import { GlobalConfig } from '@infrastructure/shared/config';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

const PinoLoggerConfig = Object.freeze({
  CONTEXT_NAME: 'context',
  LOG_LEVEL: GlobalConfig.IS_DEVELOPMENT ? LogLevel.DEBUG : LogLevel.INFO,
  LOGS_FOLDER: GlobalConfig.LOGS_FOLDER,
  LOG_HTTP: true,
  LOG_HTTP_IN_ALL_MESSAGES: false,
  LOG_ROTATION_AUDIT_FILE: 'log-audit.json',
  ROTATE_FILE_TRANSPORT_PATH: `${__dirname}/pino-rotate-file.transport`
});

class PinoLogger implements LoggerDomainService {
  private readonly defaultLogger: PinoLoggerType;

  constructor() {
    this.defaultLogger = this.configureAndGetDefaultLogger();
  }

  public get logger(): PinoLoggerType {
    return getContext()?.get(GlobalConfig.PINO_LOGGER_KEY) || this.defaultLogger;
  }

  public debug(message: any, ...optionalParameters: any[]): void {
    this.call(LogLevel.DEBUG, message, ...optionalParameters);
  }

  public info(message: any, ...optionalParameters: any[]): void {
    this.call(LogLevel.INFO, message, ...optionalParameters);
  }

  public warn(message: any, ...optionalParameters: any[]): void {
    this.call(LogLevel.WARN, message, ...optionalParameters);
  }

  public error(message: any, ...optionalParameters: any[]): void {
    this.call(LogLevel.ERROR, message, ...optionalParameters);
  }

  public createPinoHttpMiddleware(): (request: Request, response: Response, next?: NextFunction) => void {
    return pinoHttp({
      logger: this.defaultLogger,
      autoLogging: PinoLoggerConfig.LOG_HTTP,
      quietReqLogger: !PinoLoggerConfig.LOG_HTTP_IN_ALL_MESSAGES,
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        reqId: 'requestId',
        responseTime: 'timeTaken'
      },
      customSuccessMessage: (_request, response) => {
        return response.writableEnded ? 'Request completed!' : 'Request aborted!';
      },
      customErrorMessage: (_request, response) => {
        return `Request failed! An error ${response.statusCode} occurred during the HTTP request.`;
      }
    });
  }

  private call(level: Level, message: any, ...optionalParameters: any[]): void {
    const objectArgument: Record<string, any> = {};
    let parameters: any[] = [];

    if (optionalParameters.length > 0) {
      objectArgument[PinoLoggerConfig.CONTEXT_NAME] = optionalParameters.at(-1);
      parameters = optionalParameters.slice(0, -1);
    }

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objectArgument.err = message;
      } else {
        Object.assign(objectArgument, message);
      }
      this.logger[level](objectArgument, ...parameters);
    } else if (this.isWrongExceptionsHandlerContract(level, message, parameters)) {
      const error = new Error(message);
      const [errorStack] = parameters;

      objectArgument.err = error;
      objectArgument.err.stack = errorStack;

      this.logger[level](objectArgument);
    } else {
      this.logger[level](objectArgument, message, ...parameters);
    }
  }

  private isWrongExceptionsHandlerContract(level: Level, message: any, parameters: any[]): parameters is [string] {
    return (
      level === LogLevel.ERROR &&
      typeof message === 'string' &&
      parameters.length === 1 &&
      typeof parameters[0] === 'string' &&
      /\n\s*at /.test(parameters[0])
    );
  }

  private configureAndGetDefaultLogger = (): PinoLoggerType => {
    const rotateFileTarget = {
      level: LogLevel.DEBUG,
      target: PinoLoggerConfig.ROTATE_FILE_TRANSPORT_PATH,
      options: {
        folder: PinoLoggerConfig.LOGS_FOLDER,
        filename: 'all',
        extension: 'log'
      }
    };

    const errorRotateFileTarget = {
      level: LogLevel.ERROR,
      target: PinoLoggerConfig.ROTATE_FILE_TRANSPORT_PATH,
      options: {
        folder: PinoLoggerConfig.LOGS_FOLDER,
        filename: 'error',
        extension: 'log'
      }
    };

    const pinoPrettyTarget = {
      level: LogLevel.DEBUG,
      target: 'pino-pretty',
      options: { colorize: true, messageKey: 'message' }
    };

    const standardOutputTarget = {
      level: LogLevel.DEBUG,
      target: 'pino/file',
      options: { destination: 1, append: true }
    };

    const targets: TransportTargetOptions[] = [
      ...(GlobalConfig.IS_TEST ? [] : [errorRotateFileTarget, rotateFileTarget]),
      GlobalConfig.IS_DEVELOPMENT ? pinoPrettyTarget : standardOutputTarget
    ];

    return pino(
      {
        enabled: !GlobalConfig.IS_TEST && GlobalConfig.LOGS_ENABLED,
        level: PinoLoggerConfig.LOG_LEVEL,
        messageKey: 'message'
      },
      pino.transport({ targets, dedupe: false })
    );
  };
}

const PINO_LOGGER = new PinoLogger();

export type { PinoLogger };
export { PINO_LOGGER };
