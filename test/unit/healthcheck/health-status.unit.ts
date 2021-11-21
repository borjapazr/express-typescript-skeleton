import { HealthStatusResponse } from '@application/health/health-status.response';
import { HealthStatus } from '@domain/health/health-status';

describe('Testing HealthStatusResponse generation', () => {
  it('should return a valid HealthStatusResponse from domain model', () => {
    return expect(
      HealthStatusResponse.fromDomainModel(new HealthStatus('ALIVE', '🚀👩‍🚀 To infinity and beyond!'))
    ).toEqual(new HealthStatusResponse('ALIVE', '🚀👩‍🚀 To infinity and beyond!'));
  });
});
