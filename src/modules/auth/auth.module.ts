import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

import { config } from '../../config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config.env.JWT_SECRET,
      signOptions: { expiresIn: config.constants.JWT.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
