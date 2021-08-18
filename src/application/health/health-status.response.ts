import { HealthStatus } from '@domain/health/health-status';

class HealthStatusResponse {
  readonly status: string;

  readonly message: string;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }

  public static fromDomainModel(healthStatus: HealthStatus): HealthStatusResponse {
    return new HealthStatusResponse(healthStatus.status, healthStatus.message);
  }
}

export { HealthStatusResponse };
