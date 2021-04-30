import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { FoldersModule } from './modules/folders/folders.module';
import { FilesModule } from './modules/files/files.module';
import { TestModule } from './modules/tests/tests.module';
import { MailModule } from './modules/mail/mail.module';
import { CodeModule } from './modules/code/code.module';
import { MorganMiddleware } from './middleware/morgan.middleware';
import { LoggerService } from './utils/logger.service';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';
import { config } from './config/index';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    QuestionsModule,
    FoldersModule,
    FilesModule,
    TestModule,
    MailModule,
    CodeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule implements NestModule {
  logger = new LoggerService(AppModule.name);

  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(
      config.env.NODE_ENV === config.constants.DEVELOPMENT
        ? config.constants.logger.morganFormats.development
        : config.constants.logger.morganFormats.production,
      {
        stream: {
          write: (message) => this.logger.log(message.replace('\n', '')),
        },
      },
    );
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
