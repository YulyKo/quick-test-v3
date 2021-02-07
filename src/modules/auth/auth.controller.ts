import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  Head,
  Param,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { CheckEmailDto } from './dto/emailDto';
import { Public } from './auth.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('registration')
  async registration(@Body(ValidationPipe) credentials: RegistrationDto) {
    return this.authService.registration(credentials);
  }

  @Head('email/:email')
  async checkEmail(@Param(ValidationPipe) params: CheckEmailDto) {
    return this.authService.checkEmail(params);
  }
}
