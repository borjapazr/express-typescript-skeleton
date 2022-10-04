import { BaseUseCase, UseCase } from '@application/shared';
import { HealthStatus } from '@domain/health';

import { CheckHealthStatusRequest } from './check-health-status.request';
import { HealthStatusResponse } from './health-status.response';

@UseCase()
class CheckHealthStatusUseCase extends BaseUseCase<CheckHealthStatusRequest, HealthStatusResponse> {
  protected performOperation(request: CheckHealthStatusRequest): Promise<HealthStatusResponse> {
    return Promise.resolve(
      HealthStatusResponse.fromDomainModel(
        HealthStatus.create('ALIVE', '🚀 To infinity and beyond!', request.appVersion)
      )
    );
  }
}

export { CheckHealthStatusUseCase };
