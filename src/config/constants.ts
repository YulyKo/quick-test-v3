import { DocumentBuilder } from '@nestjs/swagger';

const SWAGGER = new DocumentBuilder()
  .setTitle('quick test')
  .setDescription('The API v3')
  .setVersion('1.0')
  .build();

export const constants = {
  JWT: {
    expiresIn: '60m',
    publicKey: 'isPublic',
  },
  SWAGGER,
};
