import { DocumentBuilder } from '@nestjs/swagger';

const SWAGGER = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('quick test')
  .setDescription('The API v3')
  .setVersion('1.0')
  .build();

export const constants = {
  JWT: {
    expiresIn: '720m',
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
  },
  default: {
    folder: {
      name: 'main',
      color: '#ffffff',
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
    code: {
      length: 6,
      characters: '0123456789',
    },
  },
  uuid:
    '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
};
