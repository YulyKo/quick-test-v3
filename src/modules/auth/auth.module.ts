import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { config } from '../../config';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    FoldersModule,
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
