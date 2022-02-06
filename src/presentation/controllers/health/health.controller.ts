import { StatusCodes } from 'http-status-codes';
import { Get, HttpCode, JsonController } from 'routing-controllers';

import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import { HealthStatusResponse } from '@application/health/health-status.response';

@JsonController('/healthz')
class HealthController {
  private healthCheckerUseCase: HealthCheckerUseCase;

  constructor(healthCheckerUseCase: HealthCheckerUseCase) {
    this.healthCheckerUseCase = healthCheckerUseCase;
  }

  @Get()
  @HttpCode(StatusCodes.OK)
  getHealthStatus(): Promise<HealthStatusResponse> {
    return this.healthCheckerUseCase.execute();
  }
}

export { HealthController };
