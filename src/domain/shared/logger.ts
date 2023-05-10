import { LoggerDomainService } from '@domain/shared/services';
// eslint-disable-next-line hexagonal-architecture/enforce
import { PINO_LOGGER } from '@infrastructure/shared/pino-logger';

import { Nullable } from './types';

class Logger implements LoggerDomainService {
  private static loggerInstance: LoggerDomainService = PINO_LOGGER;

  private context: Nullable<string>;

  constructor();
  constructor(context: string);
  constructor(context?: string) {
    this.context = context || null;
  }

  public static debug(message: any, ...optionalParameters: any[]): void {
    Logger.loggerInstance.debug(message, ...optionalParameters);
  }

  public static info(message: any, ...optionalParameters: any[]): void {
    Logger.loggerInstance.info(message, ...optionalParameters);
  }

  public static warn(message: any, ...optionalParameters: any[]): void {
    Logger.loggerInstance.warn(message, ...optionalParameters);
  }

  public static error(message: any, ...optionalParameters: any[]): void {
    Logger.loggerInstance.error(message, ...optionalParameters);
  }

  public debug(message: any, ...optionalParameters: any[]): void {
    const optionalParametersWithContext = this.getMergedContextWithOptionalParameters(optionalParameters);
    Logger.loggerInstance.debug(message, ...optionalParametersWithContext);
  }

  public info(message: any, ...optionalParameters: any[]): void {
    const optionalParametersWithContext = this.getMergedContextWithOptionalParameters(optionalParameters);
    Logger.loggerInstance.info(message, ...optionalParametersWithContext);
  }

  public warn(message: any, ...optionalParameters: any[]): void {
    const optionalParametersWithContext = this.getMergedContextWithOptionalParameters(optionalParameters);
    Logger.loggerInstance.warn(message, ...optionalParametersWithContext);
  }

  public error(message: any, ...optionalParameters: any[]): void {
    const optionalParametersWithContext = this.getMergedContextWithOptionalParameters(optionalParameters);
    Logger.loggerInstance.error(message, ...optionalParametersWithContext);
  }

  private getMergedContextWithOptionalParameters(optionalParameters: any[]): any[] {
    return this.context ? optionalParameters.concat(this.context) : optionalParameters;
  }
}

export { Logger };
