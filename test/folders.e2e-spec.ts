import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { config } from '../src/config';
import mockData from './mockData';

describe('Question module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let folderId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('auth request', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'testuser@test.com', password: 'qwerty123QWE' })
      .expect(200);
    accessToken = response.body.accessToken;
    userId = response.body.userId;
    done();
  });

  it('create folder (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/folders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...mockData.folder.create, folderId: userId })
      .expect(201);

    folderId = response.body.id;

    expect(response.body.name).toBe(mockData.folder.create.name);
    expect(response.body.color).toBe(mockData.folder.create.color);
    expect(response.body.folderId).toBe(userId);
    expect(response.body.id).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('update folder (PUT)', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/folders/' + folderId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.folder.update)
      .expect(200);

    expect(response.body.name).toBe(mockData.folder.update.name);
    expect(response.body.color).toBe(mockData.folder.update.color);
    expect(response.body.folderId).toBe(userId);
    expect(response.body.id).toBe(folderId);
    done();
  });

  it('get folder (GET)', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/folders/' + folderId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    expect(response.body.id).toBe(folderId);
    expect(response.body.name).toBe(mockData.folder.update.name);
    expect(response.body.color).toBe(mockData.folder.update.color);
    expect(response.body.folderId).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('delete folder (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/folders/' + folderId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
});
