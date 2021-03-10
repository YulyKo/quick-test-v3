import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { FoldersModule } from './modules/folders/folders.module';
import { FilesModule } from './modules/files/files.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    QuestionsModule,
    AnswersModule,
    FoldersModule,
    FilesModule,
    TestModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
