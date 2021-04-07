import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { config } from '../src/config';
import mockData from './mockData';

describe('Question module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let questionId: string;

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
    done();
  });

  it('create question (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.question.create)
      .expect(201);

    const question = response.body;
    questionId = question.id;

    expect(question.name).toBe(mockData.question.create.name);
    expect(question.text).toBe(mockData.question.create.text);
    expect(question.time).toBe(mockData.question.create.time);
    expect(question.template).toBe(mockData.question.create.template);
    expect(question.answerType).toBe(mockData.question.create.answerType);
    expect(question.id).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('update question (PUT)', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.question.update)
      .expect(200);

    expect(response.body.name).toBe(mockData.question.update.name);
    expect(response.body.text).toBe(mockData.question.update.text);
    expect(response.body.time).toBe(mockData.question.update.time);
    expect(response.body.id).toBe(questionId);
    done();
  });

  it('get question (GET)', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/questions/' + questionId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    expect(response.body.id).toBe(questionId);
    expect(response.body.name).toBe(mockData.question.update.name);
    expect(response.body.text).toBe(mockData.question.update.text);
    expect(response.body.time).toBe(mockData.question.update.time);
    expect(response.body.template).toBe(mockData.question.create.template);
    expect(response.body.answerType).toBe(mockData.question.create.answerType);
    expect(response.body.folderId).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('delete question (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/questions/' + questionId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
});
