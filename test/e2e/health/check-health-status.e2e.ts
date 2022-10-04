import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { TestServer } from '@test/e2e/shared';

describe('Testing health check controller/entrypoint', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(async () => {
    await TestServer.bootstrap();
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('[GET] /api/healthz', () => {
    it('should return 200 OK', async () => {
      return request.get('/api/healthz').expect(200);
    });
  });
});
