import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { config } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  config.constants.JWT.strategy.jwt,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, name: payload.username };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  config.constants.JWT.strategy.jwtRefresh,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, name: payload.username };
  }
}
