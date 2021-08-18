import { BaseUseCase } from '@application/shared/base.usecase';
import { HealthStatus } from '@domain/health/health-status';

import { HealthStatusResponse } from './health-status.response';

class HealthCheckerUseCase implements BaseUseCase<void, Promise<HealthStatusResponse>> {
  execute(): Promise<HealthStatusResponse> {
    return Promise.resolve(
      HealthStatusResponse.fromDomainModel(new HealthStatus('ALIVE', '🚀👩‍🚀 To infinity and beyond!'))
    );
  }
}

export { HealthCheckerUseCase };
