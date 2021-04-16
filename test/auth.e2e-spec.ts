import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CodeService } from '../src/modules/code/code.service';
import mockData from './mockData';
import { config } from '../src/config/index';

describe('Authorization module (e2e)', () => {
  let app: INestApplication;
  let refreshToken: string;
  let mailerService: MailerService;
  let codeService: CodeService;
  const fakeEmail = 'asdffadsf@fadsf.sadf.sdf.com';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    mailerService = moduleRef.get<MailerService>(MailerService);
    codeService = moduleRef.get<CodeService>(CodeService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('registration', () => {
    const registration = {
      name: mockData.auth.name,
      email: mockData.auth.email,
      password: mockData.auth.password,
    };

    it('create user', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send(registration)
        .expect(201);

      expect(response.body.id).toMatch(
        /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
      );
      expect(response.body.name).toBe(registration.name);
      expect(response.body.email).toBe(registration.email);

      done();
    });

    it('user with email already exist', async (done) => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(registration)
        .expect(400, {
          statusCode: 400,
          message: 'User with this email has already existed',
        });

      done();
    });
  });

  describe('login', () => {
    it('success login', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: mockData.auth.email, password: mockData.auth.password })
        .expect(200);

      refreshToken = response.body.refreshToken;

      expect(response.body.accessToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
      expect(response.body.refreshToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );

      done();
    });

    it('incorrect email', async (done) => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: fakeEmail, password: mockData.auth.password })
        .expect(400, {
          statusCode: 400,
          message: 'Wrong credentials provided',
        });

      done();
    });

    it('incorrect password', async (done) => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: mockData.auth.email, password: 'f93n9FD12odsfcom' })
        .expect(400, {
          statusCode: 400,
          message: 'Wrong credentials provided',
        });

      done();
    });
  });

  describe('refresh', () => {
    it('successfully refresh tokens', async (done) => {
      const response = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body.accessToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
      expect(response.body.refreshToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );

      refreshToken = response.body.refreshToken;

      done();
    });

    it('JWTRefreshGuard: Incorrect authorization header', async (done) => {
      await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('authorization', `Auth ${refreshToken}`)
        .expect(401, {
          statusCode: 401,
          message: 'Unauthorized',
        });

      done();
    });

    it('JWTRefreshGuard: Refresh token is not valid or expired', async (done) => {
      await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('authorization', 'Bearer fo2n3f9n32f.23fn230f23.f23f23f9')
        .expect(401, {
          statusCode: 401,
          message: 'Unauthorized',
        });

      done();
    });

    it('refresh token is not equal to user`s token', async (done) => {
      setTimeout(async () => {
        const response = await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('authorization', `Bearer ${refreshToken}`)
          .expect(200);

        await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('authorization', `Bearer ${refreshToken}`)
          .expect(400, {
            statusCode: 400,
            message: 'Refresh token is incorrect',
          });

        refreshToken = response.body.refreshToken;

        done();
      }, 2000);
    });
  });

  describe('logout', () => {
    it('success logout', async (done) => {
      await request(app.getHttpServer())
        .get('/auth/logout')
        .set('authorization', `Bearer ${refreshToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('authorization', `Bearer ${refreshToken}`)
        .expect(400, {
          statusCode: 400,
          message: 'Refresh token is incorrect',
        });

      done();
    });

    it('incorrect token', async (done) => {
      await request(app.getHttpServer())
        .get('/auth/logout')
        .set('authorization', `Bearer ${refreshToken}`)
        .expect(400, {
          statusCode: 400,
          message: 'Refresh token is incorrect',
        });

      done();
    });
  });

  describe('check if email is free', () => {
    it('NOT free', async (done) => {
      await request(app.getHttpServer())
        .head(`/auth/email/${mockData.auth.email}`)
        .expect(400);

      done();
    });

    it('free', async (done) => {
      await request(app.getHttpServer())
        .head(`/auth/email/${fakeEmail}`)
        .expect(200);

      done();
    });
  });

  describe('recover password', () => {
    let code: string;

    it('code is not in DB yet', async (done) => {
      await request(app.getHttpServer())
        .head(
          `/auth/email/${
            mockData.auth.email
          }/code/${codeService.generateCode()}`,
        )
        .expect(400);

      done();
    });

    describe('forgot password', () => {
      it('send code to email', async (done) => {
        await request(app.getHttpServer())
          .patch(`/auth/forgotPassword`)
          .send({ email: mockData.auth.email })
          .expect(200);

        done();
      });

      it('check if letter send correctly', async (done) => {
        const spyMailService = jest
          .spyOn(mailerService, 'sendMail')
          .mockImplementation(async (mail) => {
            code = mail.context.code;
          });

        await request(app.getHttpServer())
          .patch(`/auth/forgotPassword`)
          .send({ email: mockData.auth.email })
          .expect(200);

        expect(spyMailService).toBeCalledWith({
          context: {
            name: mockData.auth.name,
            code,
          },
          to: mockData.auth.email,
          from: config.constants.mailer.from,
          subject: config.constants.mailer.forgotPassword.subject,
          template: config.constants.mailer.forgotPassword.template,
        });

        done();
      });

      it('this email is not exist', async (done) => {
        await request(app.getHttpServer())
          .patch(`/auth/forgotPassword`)
          .send({ email: fakeEmail })
          .expect(400, {
            statusCode: 400,
            message: 'User with this email does not exist',
          });

        done();
      });
    });

    describe('code', () => {
      it('verified', async (done) => {
        await request(app.getHttpServer())
          .head(`/auth/email/${mockData.auth.email}/code/${code}`)
          .expect(200);

        done();
      });

      it('this email is not exist', async (done) => {
        await request(app.getHttpServer())
          .head(`/auth/email/${fakeEmail}/code/${code}`)
          .expect(400);

        done();
      });

      it('incorrect code', async (done) => {
        await request(app.getHttpServer())
          .head(
            `/auth/email/${
              mockData.auth.email
            }/code/${codeService.generateCode()}`,
          )
          .expect(400);

        done();
      });
    });

    describe('change password', () => {
      it('this email is not exist', async (done) => {
        await request(app.getHttpServer())
          .put(`/auth/changePassword`)
          .send({
            email: fakeEmail,
            code,
            password: mockData.auth.newPassword,
          })
          .expect(400, {
            statusCode: 400,
            message: 'User with this email does not exist',
          });

        done();
      });

      it('incorrect code', async (done) => {
        await request(app.getHttpServer())
          .put(`/auth/changePassword`)
          .send({
            email: mockData.auth.email,
            code: codeService.generateCode(),
            password: mockData.auth.newPassword,
          })
          .expect(400, {
            statusCode: 400,
            message: 'Incorrect or expired code',
          });

        done();
      });

      it('input new password', async (done) => {
        await request(app.getHttpServer())
          .put(`/auth/changePassword`)
          .send({
            email: mockData.auth.email,
            code,
            password: mockData.auth.password,
          })
          .expect(400, {
            statusCode: 400,
            message: 'Input new password',
          });

        done();
      });

      it('success', async (done) => {
        await request(app.getHttpServer())
          .put(`/auth/changePassword`)
          .send({
            email: mockData.auth.email,
            code,
            password: mockData.auth.newPassword,
          })
          .expect(200);

        await request(app.getHttpServer())
          .post(`/auth/login`)
          .send({
            email: mockData.auth.email,
            password: mockData.auth.newPassword,
          })
          .expect(200);

        await request(app.getHttpServer())
          .post(`/auth/login`)
          .send({
            email: mockData.auth.email,
            password: mockData.auth.password,
          })
          .expect(400, {
            statusCode: 400,
            message: 'Wrong credentials provided',
          });

        done();
      });

      it('no code in DB', async (done) => {
        await request(app.getHttpServer())
          .put(`/auth/changePassword`)
          .send({
            email: mockData.auth.email,
            code,
            password: mockData.auth.newPassword,
          })
          .expect(400, {
            statusCode: 400,
            message: 'First send code',
          });

        done();
      });
    });
  });
});
