import * as request from 'supertest';
import { setupE2E, closeE2E, createTestUser } from './setup-e2e';

let server: any;
let jwtAccessToken: string;

describe('UserController', () => {
  beforeAll(async () => {
    const setup = await setupE2E();
    server = setup.server;

    // ✅ Register test user and get access token
    const testUser = await createTestUser(server);
    jwtAccessToken = testUser.accessToken;
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('/users/me', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(server)
        .get('/users/me')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
    });

    it('should return Unauthorized error if token is missing', async () => {
      await request(server).get('/users/me').expect(401);
    });
  });

  describe('/users/update', () => {
    it('should update user profile successfully', async () => {
      const updateUserDto = {
        name: 'Updated Name',
        birthPlace: 'Demak',
        birthDate: '1996-06-14',
        height: 175,
        weight: 60,
      };

      const response = await request(server)
        .put('/users/update')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.birthPlace).toBe(updateUserDto.birthPlace);
    });

    it('should return bad request if update data is invalid', async () => {
      const updateUserDto = {
        name: 'Updated Name',
        birthDate: 'invalid-date', // Invalid date format
      };

      await request(server)
        .put('/users/update')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send(updateUserDto)
        .expect(400);
    });
  });

  describe('/users/search', () => {
    it('should return user list by search query', async () => {
      const response = await request(server)
        .get('/users/search')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send({ query: 'testuser' })
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    it('should return bad request if query is missing', async () => {
      await request(server)
        .get('/users/search')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send({})
        .expect(400);
    });
  });

  
});
