import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { config } from '../../config';
import { JwtTokenBody } from './jwt-body.interface';

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

  async validate(payload: JwtTokenBody) {
    return { id: payload.id };
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

  async validate(payload: JwtTokenBody) {
    return { id: payload.id };
  }
}

@Injectable()
export class JwtWsStrategy extends PassportStrategy(
  Strategy,
  config.constants.JWT.strategy.jwtWs,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwtTokenFieldName'),
      ignoreExpiration: false,
      secretOrKey: config.env.JWT_WS_SECRET,
    });
  }

  async validate(payload: JwtTokenBody) {
    return { id: payload.id };
  }
}
