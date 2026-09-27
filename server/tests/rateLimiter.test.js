const request = require('supertest');

describe('POST /api/scan rate limiting', () => {
  let app;

  beforeAll(() => {
    process.env.RATE_LIMIT_MAX_SCANS_PER_IP = '2';
    process.env.RATE_LIMIT_WINDOW_MINUTES = '60';
    process.env.DEMO_MODE = 'true';
    const createApp = require('../src/app');
    app = createApp();
  });

  test('allows requests under the limit and blocks beyond it', async () => {
    const email = 'test@example.com';

    const first = await request(app).post('/api/scan').send({ email });
    expect(first.status).toBe(200);

    const second = await request(app).post('/api/scan').send({ email });
    expect(second.status).toBe(200);

    const third = await request(app).post('/api/scan').send({ email });
    expect(third.status).toBe(429);
    expect(third.body.error).toBe('RATE_LIMITED');
  }, 20000);
});

describe('POST /api/scan validation', () => {
  let app;

  beforeAll(() => {
    process.env.RATE_LIMIT_MAX_SCANS_PER_IP = '50';
    const createApp = require('../src/app');
    app = createApp();
  });

  test('rejects missing email', async () => {
    const res = await request(app).post('/api/scan').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('MISSING_EMAIL');
  });

  test('rejects invalid email format', async () => {
    const res = await request(app).post('/api/scan').send({ email: 'invalid@email' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_EMAIL');
  });

  test('accepts a valid email in demo mode', async () => {
    const res = await request(app).post('/api/scan').send({ email: 'valid.user@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.emailMasked).not.toContain('valid.user@example.com');
    expect(res.body.riskScore).toBeDefined();
  });
});
