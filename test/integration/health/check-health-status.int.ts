import { CheckHealthStatusRequest, CheckHealthStatusUseCase, HealthStatusResponse } from '@application/health';
import { TriggeredByAnonymous } from '@domain/shared/entities/triggered-by';
import { AppInfo } from '@presentation/rest/config';

describe('Testing health check use case', () => {
  it('should return ALIVE health status', () => {
    const checkHealthStatusUseCase = new CheckHealthStatusUseCase();
    return expect(
      checkHealthStatusUseCase.execute(new CheckHealthStatusRequest(new TriggeredByAnonymous(), AppInfo.APP_VERSION))
    ).resolves.toEqual(HealthStatusResponse.create('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION));
  });
});
