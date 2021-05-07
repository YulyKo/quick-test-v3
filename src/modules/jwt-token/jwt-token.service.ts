import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtOptions, JwtTokenBody } from './jwt-body.interface';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  generate(payload: JwtTokenBody, options: JwtOptions): string {
    return this.jwtService.sign(payload, options);
  }

  getSignature(token: string): string {
    return token.slice(token.lastIndexOf('.') + 1);
  }
}
