import { Context, Get } from '@tsed/common';
import { Description, Returns, Status, Summary, Tags, Title } from '@tsed/schema';
import { StatusCodes } from 'http-status-codes';

import { CheckHealthStatusRequest, CheckHealthStatusUseCase } from '@application/health';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { AppConfig, AppInfo } from '@presentation/rest/config';
import { RestController } from '@presentation/rest/shared/rest-controller.decorator';

import { HealthApiResponse } from './health.api-response';

@RestController('/healthz')
@Tags({ name: 'Health', description: 'Status and health check' })
class HealthController {
  private checkHealthStatusUseCase: CheckHealthStatusUseCase;

  constructor(checkHealthStatusUseCase: CheckHealthStatusUseCase) {
    this.checkHealthStatusUseCase = checkHealthStatusUseCase;
  }

  @Get()
  @Title('Health')
  @Summary('Health check')
  @Description('Endpoint to check whether the application is healthy or unhealthy')
  @Returns(StatusCodes.OK, HealthApiResponse)
  @Status(StatusCodes.OK, HealthApiResponse)
  public async checkHealthStatus(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy
  ): Promise<HealthApiResponse> {
    return HealthApiResponse.fromHealthApiResponse(
      await this.checkHealthStatusUseCase.execute(CheckHealthStatusRequest.create(triggeredBy, AppInfo.APP_VERSION))
    );
  }
}

export { HealthController };
