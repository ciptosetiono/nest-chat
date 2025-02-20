import * as request from 'supertest';
import * as path from 'path';
import { setupE2E, closeE2E, createTestUser, validUser } from './setup-e2e';

let server: any;
let jwtAccessToken: string;
let roomId: string;
let fileId: string;
const filePath = path.join(__dirname, 'assets', 'test-file.jpeg'); 
  
describe('FileController', () => {
  beforeAll(async () => {
    const setup = await setupE2E();
    server = setup.server;

    //Create test user
    const testUser = await createTestUser(server);
    jwtAccessToken = testUser.accessToken;

    // Create test room
    const createRoomDto = {
      name: 'Test Room',
      members: [validUser.username],
      type: 'PERSONAL',
    };

    const roomResponse = await request(server)
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAccessToken}`)
      .send(createRoomDto)
      .expect(201);

    roomId = roomResponse.body._id;
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('/files/upload/:roomId (POST)', () => {
    it('should upload a file successfully', async () => {
        const response = await request(server)
            .post(`/files/upload/${roomId}`)
            .set('Authorization', `Bearer ${jwtAccessToken}`)
            .field('file', filePath) // Set file in body request
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('filePath');

        fileId = response.body._id; // Save fileId for download test
    });

    it('should return Unauthorized if no JWT', async () => {
        await request(server)
            .post(`/files/upload/${roomId}`)
            .field('file', filePath) // Set file in body request
            .expect(401);
    });
  
  });

  
  describe('/files/download/:fileId (GET)', () => {
    it('should download an uploaded file', async () => {
      const response = await request(server)
        .get(`/files/download/${fileId}`)
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/octet-stream');
    });

    it('should return 404 if file does not exist', async () => {
      await request(server)
        .get('/files/download/invalidFileId')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .expect(404);
    });

    it('should return Unauthorized if no JWT', async () => {
      await request(server)
        .get(`/files/download/${fileId}`)
        .expect(401);
    });
  });
  
});
