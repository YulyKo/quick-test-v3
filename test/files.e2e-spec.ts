import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import mockData from './mockData';

describe('Question module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;
  let questionId1: string;
  let folderId1: string;
  let questionId2: string;
  let folderId2: string;

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

  it('create questions and folders', async (done) => {
    const response1 = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.question.create)
      .expect(201);

    questionId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.question.create)
      .expect(201);

    questionId2 = response2.body.id;

    const response3 = await request(app.getHttpServer())
      .post('/folders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...mockData.folder.create, folderId: userId })
      .expect(201);

    folderId1 = response3.body.id;

    const response4 = await request(app.getHttpServer())
      .post('/folders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...mockData.folder.create, folderId: userId })
      .expect(201);

    folderId2 = response4.body.id;

    done();
  });
  it('move question 1 from root in folder 1', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId1)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        folderId: folderId1,
      })
      .expect(200);

    expect(response.body.folderId).toBe(folderId1);
    done();
  });
  it('move question 2 from root in folder 2', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId2)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        folderId: folderId2,
      })
      .expect(200);

    expect(response.body.folderId).toBe(folderId2);
    done();
  });
  it('move folder 2 from root in folder 1', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/folders/' + folderId2)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        folderId: folderId1,
      })
      .expect(200);

    expect(response.body.folderId).toBe(folderId1);
    done();
  });
  it('move question 2 from folder 2 in root', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId2)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        folderId: userId,
      })
      .expect(200);

    expect(response.body.folderId).toBe(userId);
    done();
  });
  it('delete folder1 (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/folders/' + folderId1)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
  it('delete question2 (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/questions/' + questionId2)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
});
