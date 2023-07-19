import { SuperTestRequest, TestServer } from '@test/e2e/shared';

describe('Testing health check controller/entrypoint', () => {
  let request: SuperTestRequest;

  beforeAll(async () => {
    await TestServer.bootstrap();
    request = TestServer.getSuperTestRequest();
  });
  afterAll(async () => {
    await TestServer.reset();
  });

  describe('[GET] /api/healthz', () => {
    it('should return 200 OK', async () => {
      return request.get('/api/healthz').expect(200);
    });
  });
});
