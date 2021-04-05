import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { config } from '../src/config';
import mockData from './mockData';

describe('Answer module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let questionId: string;
  let answerId: string;

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

  it('create question for answer (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.question.create)
      .expect(201);

    questionId = response.body.id;

    expect(response.body.name).toBe(mockData.question.create.name);
    expect(response.body.text).toBe(mockData.question.create.text);
    expect(response.body.time).toBe(mockData.question.create.time);
    expect(response.body.template).toBe(mockData.question.create.template);
    expect(response.body.answerType).toBe(mockData.question.create.answerType);
    expect(response.body.id).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('create answer in question (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/questions/' + questionId + '/answers')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.answer.create)
      .expect(201);

    answerId = response.body.id;

    expect(response.body.name).toBe(mockData.answer.create.name);
    expect(response.body.isTrue).toBe(mockData.answer.create.isTrue);
    expect(response.body.id).toMatch(new RegExp(config.constants.uuid));
    done();
  });

  it('update answer in question (PUT)', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId + '/answers/' + answerId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(mockData.answer.update)
      .expect(200);

    expect(response.body.name).toBe(mockData.answer.update.name);
    expect(response.body.isTrue).toBe(mockData.answer.update.isTrue);
    expect(response.body.id).toBe(answerId);
    done();
  });

  it('get question (GET)', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/questions/' + questionId + '/answers/' + answerId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    expect(response.body.id).toBe(answerId);
    expect(response.body.name).toBe(mockData.answer.update.name);
    expect(response.body.isTrue).toBe(mockData.answer.update.isTrue);
    done();
  });

  it('delete answer (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/questions/' + questionId + '/answers/' + answerId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
  it('delete question (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/questions/' + questionId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(done);
  });
});
