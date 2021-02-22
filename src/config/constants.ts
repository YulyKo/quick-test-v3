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
};
