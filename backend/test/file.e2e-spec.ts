import * as request from 'supertest';
import * as path from 'path';
import { setupE2E, closeE2E, createTestUser, validUser } from './setup-e2e';
import { RoomType } from '../src/room/room.schema';

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
      type: RoomType.PERSONAL,
    };


    const response = await request(server)
          .post('/rooms/create')
          .set('Authorization', `Bearer ${jwtAccessToken}`)
          .send(createRoomDto)
          .expect(201);
 
    roomId = response.body._id.toString();

  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('/files/upload/:roomId (POST)', () => {
    it('should upload a file successfully', async () => {
      const response = await request(server)
          .post(`/files/upload/${roomId}`)
          .set('Authorization', `Bearer ${jwtAccessToken}`)
          .attach('file', filePath)
          .expect(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('files');
      expect(response.body.files.length).toBeGreaterThanOrEqual(1);

      const fileModel = response.body.files[0];
      expect(fileModel).toHaveProperty('_id');

      fileId = fileModel._id.toString();

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

      // Check if response header is a file type
      expect(response.header['content-type']).toBe('image/jpeg'); // Adjust based on expected file type

      //Check if response is a buffer (file data)
      expect(Buffer.isBuffer(response.body)).toBe(true);
    });

   
    it('should return 404 if file does not exist', async () => {
      await request(server)
        .get('/files/download/invalidFileId')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .expect(404);
    });
    /*
    it('should return Unauthorized if no JWT', async () => {
      await request(server)
        .get(`/files/download/${fileId}`)
        .expect(401);
    });
    */
  });
  
  
  
});
