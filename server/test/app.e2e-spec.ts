import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { jest } from '@jest/globals';
import type { Server } from 'node:http';
import request from 'supertest';
import { LeadsService } from '../src/modules/leads/leads.service.js';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.ADMIN_API_KEY = 'test-admin-api-key-at-least-32-characters';
    process.env.CORS_ORIGINS = 'http://localhost:3000';
    const { AppModule } = await import('../src/app.module.js');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LeadsService)
      .useValue({
        create: jest.fn(() => ({
          id: '00000000-0000-4000-8000-000000000001',
          status: 'NEW',
          createdAt: new Date(),
        })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('GET /api/v1/health', () => {
    return request(app.getHttpServer() as Server)
      .get('/api/v1/health')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('protects admin endpoints', () => {
    return request(app.getHttpServer() as Server)
      .get('/api/v1/admin/projects')
      .expect(401);
  });

  it('rate limits public lead submissions', async () => {
    const server = app.getHttpServer() as Server;
    const body = { fullName: 'Nguyễn Văn An', phone: '0901234567' };

    for (let index = 0; index < 20; index += 1) {
      await request(server).post('/api/v1/leads').send(body).expect(201);
    }

    await request(server).post('/api/v1/leads').send(body).expect(429);
  });

  afterAll(async () => {
    await app.close();
  });
});
