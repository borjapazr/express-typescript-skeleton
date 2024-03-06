import { Default, Property } from '@tsed/schema';

import { AppInfo } from '@contract/rest/config';
import { HealthStatusResponse } from '@modules/health/application';

class HealthStatusApiResponse {
  @Property()
  readonly status: string;

  @Property()
  readonly message: string;

  @Property()
  @Default(AppInfo.APP_VERSION)
  readonly appVersion: string = AppInfo.APP_VERSION;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }

  public static fromHealthStatusResponse(healthStatus: HealthStatusResponse): HealthStatusResponse {
    return new HealthStatusApiResponse(healthStatus.status, healthStatus.message);
  }
}

export { HealthStatusApiResponse };
