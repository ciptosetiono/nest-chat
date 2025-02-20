import * as request from 'supertest';
import { setupE2E, closeE2E, validUser } from './setup-e2e';

let server: any;

describe('AuthController', () => {
  beforeAll(async () => {
    const setup = await setupE2E();
    server = setup.server;
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('/auth/register', () => {
    it('should register a user and return accessToken', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return bad request if user data is invalid', async () => {
      await request(server)
        .post('/auth/register')
        .send({ email: 'invalid-email', password: '123' })
        .expect(400);
    });
  });

  describe('/auth/login', () => {
    it('should return a JWT token if user is valid', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return bad request if login data is invalid', async () => {
      await request(server)
        .post('/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' })
        .expect(403);
    });
  });
});
