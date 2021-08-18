interface Logger {
  silly(value: string | unknown): void;
  debug(value: string | unknown): void;
  verbose(value: string | unknown): void;
  http(value: string | unknown): void;
  info(value: string | unknown): void;
  warn(value: string | unknown): void;
  error(value: string | unknown): void;
  error(value: string | Error | unknown): void;
}

export { Logger };
