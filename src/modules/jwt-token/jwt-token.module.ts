import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';
import { config } from '../../config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: config.env.JWT_ACCESS_EXPIRATION_TIME },
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService, JwtModule],
})
export class JwtTokenModule {}
