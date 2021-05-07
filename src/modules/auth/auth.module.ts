import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../users/users.module';
import { FoldersModule } from '../folders/folders.module';
import { MailModule } from '../mail/mail.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, JwtRefreshStrategy } from '../jwt-token/jwt.strategy';
import { CodeModule } from '../code/code.module';

@Module({
  imports: [
    MailModule,
    UserModule,
    PassportModule,
    FoldersModule,
    JwtTokenModule,
    CodeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
