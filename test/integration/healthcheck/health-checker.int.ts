import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import { HealthStatusResponse } from '@application/health/health-status.response';

describe('Testing health check use case', () => {
  it('should return ALIVE health status', () => {
    const healthCheckerUseCase = new HealthCheckerUseCase();
    return expect(healthCheckerUseCase.execute()).resolves.toEqual(
      new HealthStatusResponse('ALIVE', '🚀 To infinity and beyond!')
    );
  });
});
