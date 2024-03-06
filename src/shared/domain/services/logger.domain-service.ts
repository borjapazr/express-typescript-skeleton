interface LoggerDomainService {
  debug(message: any, ...optionalParameters: any[]): void;

  info(message: any, ...optionalParameters: any[]): void;

  warn(message: any, ...optionalParameters: any[]): void;

  error(message: any, ...optionalParameters: any[]): void;
}

export { LoggerDomainService };
