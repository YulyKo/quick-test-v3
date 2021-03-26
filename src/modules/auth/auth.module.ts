import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { JwtStrategy, JwtRefreshStrategy } from './jwt.strategy';
import { config } from '../../config';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    FoldersModule,
    JwtModule.register({
      secret: config.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: config.env.JWT_ACCESS_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
