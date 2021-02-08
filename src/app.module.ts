import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, QuestionModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
