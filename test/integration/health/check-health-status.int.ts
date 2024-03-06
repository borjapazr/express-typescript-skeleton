import { AppInfo } from '@contract/rest/config';
import { CheckHealthStatusRequest, CheckHealthStatusUseCase, HealthStatusResponse } from '@modules/health/application';
import { TriggeredByAnonymous } from '@shared/domain/entities/triggered-by';

describe('Testing health check use case', () => {
  it('should return ALIVE health status', () => {
    const checkHealthStatusUseCase = new CheckHealthStatusUseCase();
    return expect(
      checkHealthStatusUseCase.execute(new CheckHealthStatusRequest(new TriggeredByAnonymous(), AppInfo.APP_VERSION))
    ).resolves.toEqual(HealthStatusResponse.create('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION));
  });
});
