import { Context, Get } from '@tsed/common';
import { Description, Returns, Status, Summary, Tags, Title } from '@tsed/schema';
import { StatusCodes } from 'http-status-codes';

import { CheckHealthStatusRequest, CheckHealthStatusUseCase } from '@application/health';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { AppConfig, AppInfo } from '@presentation/rest/config';
import { RestController } from '@presentation/rest/shared/rest-controller.decorator';

import { HealthStatusApiResponse } from './health-status.api-response';

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
  @Returns(StatusCodes.OK, HealthStatusApiResponse)
  @Status(StatusCodes.OK, HealthStatusApiResponse)
  public async checkHealthStatus(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy
  ): Promise<HealthStatusApiResponse> {
    return HealthStatusApiResponse.fromHealthStatusResponse(
      await this.checkHealthStatusUseCase.execute(CheckHealthStatusRequest.create(triggeredBy, AppInfo.APP_VERSION))
    );
  }
}

export { HealthController };
