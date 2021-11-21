import request from 'supertest';

import { App } from '@presentation/app';

describe('Testing health check controller/entrypoint', () => {
  describe('[GET] /api/healthz', () => {
    it('should return 200', () => {
      const app = new App();
      return request(app.getServer()).get('/api/healthz').expect(200);
    });
  });
});
