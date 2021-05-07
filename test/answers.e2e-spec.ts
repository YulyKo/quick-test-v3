import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { config } from '../src/config';
import mockData from './mockData';

describe('Answer module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let questionId: string;
  const answerIds: string[] = [];

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

  it('create question and 3 answers (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        ...mockData.question.create,
        answers: [
          mockData.answer.create,
          mockData.answer.create,
          mockData.answer.create,
        ],
      })
      .expect(201);

    const question = response.body;
    questionId = question.id;
    question.answers.forEach((answer) => {
      expect(answer.name).toBe(mockData.answer.create.name);
      expect(answer.isTrue).toBe(mockData.answer.create.isTrue);
      expect(answer.id).toMatch(new RegExp(config.constants.uuid));
      answerIds.push(answer.id);
    });

    done();
  });

  it('create answer in question (POST)', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/questions/' + questionId + '/answers')
      .set('Authorization', 'Bearer ' + accessToken)
      .send([mockData.answer.create])
      .expect(201);

    const [answer] = response.body;

    expect(answer.name).toBe(mockData.answer.create.name);
    expect(answer.isTrue).toBe(mockData.answer.create.isTrue);
    expect(answer.id).toMatch(new RegExp(config.constants.uuid));
    answerIds.push(answer.id);
    done();
  });

  it('update answer in question (PUT)', async (done) => {
    const response = await request(app.getHttpServer())
      .put('/questions/' + questionId + '/answers/' + answerIds.join())
      .set('Authorization', 'Bearer ' + accessToken)
      .send([
        mockData.answer.update,
        mockData.answer.update,
        mockData.answer.update,
        mockData.answer.update,
      ])
      .expect(200);

    response.body.forEach((answer, index) => {
      expect(answer.name).toBe(mockData.answer.update.name);
      expect(answer.isTrue).toBe(mockData.answer.update.isTrue);
      expect(answer.id).toBe(answerIds[index]);
    });
    done();
  });

  it('get question (GET)', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/questions/' + questionId + '/answers/' + answerIds.join())
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    response.body.forEach((answer, index) => {
      expect(answer.name).toBe(mockData.answer.update.name);
      expect(answer.isTrue).toBe(mockData.answer.update.isTrue);
      expect(answer.id).toBe(answerIds[index]);
    });
    done();
  });

  it('delete answer (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete('/questions/' + questionId + '/answers/' + answerIds.join())
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
