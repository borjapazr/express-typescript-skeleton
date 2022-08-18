import { HealthStatus } from '@domain/health';

class HealthStatusResponse {
  readonly status: string;

  readonly message: string;

  readonly appVersion: string;

  constructor(status: string, message: string, appVersion: string) {
    this.status = status;
    this.message = message;
    this.appVersion = appVersion;
  }

  public static create(status: string, message: string, appVersion: string): HealthStatusResponse {
    return new HealthStatusResponse(status, message, appVersion);
  }

  public static fromDomainModel(healthStatus: HealthStatus): HealthStatusResponse {
    return new HealthStatusResponse(healthStatus.status, healthStatus.message, healthStatus.appVersion);
  }
}

export { HealthStatusResponse };
