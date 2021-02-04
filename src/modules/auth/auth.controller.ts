import { Controller, Post, ValidationPipe, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
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
}
