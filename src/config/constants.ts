import { DocumentBuilder } from '@nestjs/swagger';

const SWAGGER = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('quick test')
  .setDescription('The API v3')
  .setVersion('1.0')
  .build();

export const constants = {
  JWT: {
    publicKey: 'isPublic',
    strategy: {
      jwt: 'jwt',
      jwtRefresh: 'jwt-refresh',
    },
  },
  SWAGGER,
  auth: {
    name: {
      min: 2,
      max: 20,
    },
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/,
    code: {
      expiresIn: 60 * 60 * 1000,
    },
  },
  default: {
    folder: {
      name: 'main',
      color: '#ffffff',
    },
    mailer: {
      from: '"quick-test" <noreply@quicktest.com>',
    },
  },
  question: {
    name: {
      min: 2,
      max: 20,
    },
    text: {
      min: 2,
      max: 200,
    },
    time: {
      min: 15,
      max: 60,
    },
  },
  test: {
    name: {
      min: 2,
      max: 20,
    },
    text: {
      min: 2,
      max: 200,
    },
  },
  mailer: {
    OAuthPlayground: 'https://developers.google.com/oauthplayground',
    forgotPassword: {
      subject: 'Quick-test Відновлення паролю',
      template: 'forgotPassword',
    },
    transport: {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
      },
    },
    from: 'noreply@quicktest.com',
    dir: '/templates',
  },
  code: {
    regexp: /^[a-zA-Z0-9]{6}$/,
    length: 6,
    characters:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  },
};
