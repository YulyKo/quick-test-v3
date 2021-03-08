import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const document = SwaggerModule.createDocument(app, config.constants.SWAGGER);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(config.env.PORT);
}
bootstrap();
