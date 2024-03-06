import { AppInfo } from '@contract/rest/config';
import { HealthStatusResponse } from '@modules/health/application';
import { HealthStatus } from '@modules/health/domain';

describe('Testing HealthStatusResponse generation', () => {
  it('should return a valid HealthStatusResponse from domain model', () => {
    return expect(
      HealthStatusResponse.fromDomainModel(new HealthStatus('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION))
    ).toEqual(HealthStatusResponse.create('ALIVE', '🚀 To infinity and beyond!', AppInfo.APP_VERSION));
  });
});
