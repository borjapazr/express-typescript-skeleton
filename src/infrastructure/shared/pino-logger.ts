import { getContext } from '@tsed/di';
import { NextFunction, Request, Response } from 'express';
import * as FileStreamRotator from 'file-stream-rotator';
import pino, { Level, Logger as PinoLoggerType, StreamEntry } from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';

import { LoggerDomainService } from '@domain/shared/services/logger.domain-service';

import { GlobalConfig } from './config';

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
  LOG_ROTATION_AUDIT_FILE: 'log-audit.json'
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
      objectArgument[PinoLoggerConfig.CONTEXT_NAME] = optionalParameters[optionalParameters.length - 1];
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
    const createDestinationWithRotation = (destination: string): any =>
      FileStreamRotator.getStream({
        filename: `${destination}.%DATE%`,
        frequency: 'date',
        extension: '.log',
        utc: true,
        verbose: false,
        date_format: 'YYYYMM',
        audit_file: `${PinoLoggerConfig.LOGS_FOLDER}/${PinoLoggerConfig.LOG_ROTATION_AUDIT_FILE}`
      });

    const streams: StreamEntry[] = [
      {
        level: LogLevel.DEBUG,
        stream: GlobalConfig.IS_DEVELOPMENT
          ? pinoPretty({
              colorize: true,
              messageKey: 'message'
            })
          : process.stdout
      },
      { level: LogLevel.DEBUG, stream: createDestinationWithRotation(`${PinoLoggerConfig.LOGS_FOLDER}/all`) },
      { level: LogLevel.ERROR, stream: createDestinationWithRotation(`${PinoLoggerConfig.LOGS_FOLDER}/error`) }
    ];

    return pino(
      {
        level: PinoLoggerConfig.LOG_LEVEL,
        formatters: {
          level: label => {
            return { level: label };
          }
        },
        messageKey: 'message'
      },
      pino.multistream(streams, { dedupe: false })
    );
  };
}

const PINO_LOGGER = new PinoLogger();

export type { PinoLogger };
export { PINO_LOGGER };
