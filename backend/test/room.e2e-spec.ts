import * as request from 'supertest';
import { setupE2E, closeE2E, createTestUser, validUser } from './setup-e2e';
import { CreateRoomDto } from '../src/room/dto';
import { RoomType } from '../src/room/room.schema';

let server: any;
let jwtAccessToken: string;
let roomId;


export const createRoomDto: CreateRoomDto = {
  name: 'Test Room',
  members: [validUser.username],
  type: RoomType.PERSONAL
}

describe('RoomController', () => {
  beforeAll(async () => {
    const setup = await setupE2E();
    server = setup.server;

    // ✅ Register test user and get access token
    const testUser = await createTestUser(server);
    jwtAccessToken = testUser.accessToken;

    // Create a test room before running other tests
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

  describe('/rooms/create', () => {

    it('should return Room if Request Data Valid', async () => {
      const response = await request(server)
        .post('/rooms/create')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send(createRoomDto)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
    });

    it('should return bad request exception if request data invalid', async() =>{
      const invalidRoomDto: CreateRoomDto = {
        name: '', //empty name
        members: [validUser.username],
        type: RoomType.PERSONAL
      }
      await request(server)
        .post('/rooms/create')
        .set('Authorization', `Bearer ${jwtAccessToken}`)
        .send( invalidRoomDto)
        .expect(400);
      });
  });

  describe('/rooms', () => {

    it('should return room list', async () => {
        const response = await request(server)
                          .get('/rooms')
                          .set('Authorization', `Bearer ${jwtAccessToken}`)
                          .expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

    });

  });

  describe('/rooms/:id', () => {
    it('should return a Room By Id', async () => {
        const response = await request(server)
                          .get(`/rooms/${roomId}`)
                          .set('Authorization', `Bearer ${jwtAccessToken}`)
                          .expect(200);
        expect(response.body).toHaveProperty('_id', roomId);
    });

    it('should return not found exception if roomId is invalid', async() => {
      const invalidRoomId = "invalidroomId";
      await request(server)
              .get(`/rooms/${invalidRoomId}`)
              .set('Authorization', `Bearer ${jwtAccessToken}`)
              .expect(404);
      });

  });

  describe('/rooms/me', () => {
    it('should return list Rooms that the user is in members', async () => {
        const response = await request(server)
                          .get('/rooms/me')
                          .set('Authorization', `Bearer ${jwtAccessToken}`)
                          .expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(1);
    });
  });

  describe('/rooms/search', () => {
     it('should return Room list by search query', async () => {
          const response = await request(server)
            .get('/rooms/search')
            .set('Authorization', `Bearer ${jwtAccessToken}`)
            .send({ query:   createRoomDto.name})
            .expect(200);
          expect(response.body).toHaveProperty('rooms');
          expect(response.body.rooms).toBeInstanceOf(Array);
          expect(response.body.rooms.length).toBeGreaterThan(0);
    });

  });

});
