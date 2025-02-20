import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

let mongod: MongoMemoryServer;
let app: INestApplication;
let server: any;
let jwtAccessToken: string;

export const setupE2E = async () => {
  // ✅ Setup in-memory MongoDB
  mongod = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongod.getUri();

  // ✅ Create NestJS app
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const httpServer = await app.listen(0); // `0` lets the OS pick an available port
  const server = app.getHttpServer();
  const address = httpServer.address();
  const port = typeof address === 'string' ? address : address?.port;
  await app.init();

  return { app, server, port, mongod };
};

export const closeE2E = async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongod.stop();
  await app.close();
};

export const validUser = {
    username: 'testuser',
    name: 'test user',
    email: 'test@example.com',
    password: 'Test1234!',
};

// ✅ Helper function to create a test user
export const createTestUser = async (server: any) => {
  const response = await request(server).post('/auth/register').send(validUser);
  jwtAccessToken = response.body.accessToken;
  return { accessToken: jwtAccessToken, user: response.body.user };
};

export { app, server, jwtAccessToken };
