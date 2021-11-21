import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import { HealthStatus } from '@domain/health/health-status';

describe('Testing health check use case', () => {
  it('should return ALIVE health status', () => {
    const healthCheckerUseCase = new HealthCheckerUseCase();
    return expect(healthCheckerUseCase.execute()).resolves.toEqual(
      new HealthStatus('ALIVE', '🚀👩‍🚀 To infinity and beyond!')
    );
  });
});
