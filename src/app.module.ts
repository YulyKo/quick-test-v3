import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { JwtAuthGuard } from './modules/jwt-token/jwt-auth.guard';
import { FoldersModule } from './modules/folders/folders.module';
import { FilesModule } from './modules/files/files.module';
import { TestModule } from './modules/tests/tests.module';
import { MailModule } from './modules/mail/mail.module';
import { CodeModule } from './modules/code/code.module';
import { JwtTokenModule } from './modules/jwt-token/jwt-token.module';

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
    JwtTokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
