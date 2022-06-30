import { HealthStatus } from '@domain/health/health-status';
import { AppInfo } from '@presentation/config/app.config';

class HealthStatusResponse {
  readonly status: string;

  readonly message: string;

  readonly appVersion = AppInfo.APP_VERSION;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }

  public static fromDomainModel(healthStatus: HealthStatus): HealthStatusResponse {
    return new HealthStatusResponse(healthStatus.status, healthStatus.message);
  }
}

export { HealthStatusResponse };
