import request from 'supertest';

import { app } from '@test/bootstrap';

describe('Testing health check controller/entrypoint', () => {
  describe('[GET] /api/healthz', () => {
    it('should return 200 OK', async () => {
      return request(app.getServer()).get('/api/healthz').expect(200);
    });
  });
});
