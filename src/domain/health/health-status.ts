import { DomainEntity } from '@domain/shared/entities';

class HealthStatus extends DomainEntity {
  readonly status: string;

  readonly message: string;

  readonly appVersion: string;

  constructor(status: string, message: string, appVersion: string) {
    super();
    this.status = status;
    this.message = message;
    this.appVersion = appVersion;
  }

  public static create(status: string, message: string, appVersion: string): HealthStatus {
    return new HealthStatus(status, message, appVersion);
  }
}

export { HealthStatus };
