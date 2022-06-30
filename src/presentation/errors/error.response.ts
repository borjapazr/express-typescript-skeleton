import { AppInfo } from '@presentation/config/app.config';

class ErrorResponse {
  public status: number;

  public code: string;

  public message: string;

  readonly appVersion = AppInfo.APP_VERSION;

  constructor(status: number, code: string, message: string) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export { ErrorResponse };
