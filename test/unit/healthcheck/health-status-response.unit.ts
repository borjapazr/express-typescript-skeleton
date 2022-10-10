import { HealthStatusResponse } from '@application/health';
import { HealthStatus } from '@domain/health';
import { AppInfo } from '@presentation/rest/config';

describe('Testing HealthStatusResponse generation', () => {
  it('should return a valid HealthStatusResponse from domain model', () => {
    return expect(
      HealthStatusResponse.fromDomainModel(new HealthStatus('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION))
    ).toEqual(HealthStatusResponse.create('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION));
  });
});
