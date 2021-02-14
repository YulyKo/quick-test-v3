import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  Head,
  Param,
  HttpStatus,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { EmailDto } from './dto/emailDto';
import { Public } from './auth.decorator';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        access_token: 'some access_token',
      },
    },
  })
  @Post('login')
  async login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'registration user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        email: 'user email',
        name: 'user token',
        id: 'user id',
      },
    },
  })
  @Post('registration')
  async registration(@Body(ValidationPipe) credentials: RegistrationDto) {
    return this.authService.registration(credentials);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'this email has already existed',
  })
  @ApiOperation({ summary: 'check if email is free' })
  @Head('email/:email')
  async checkEmail(@Param(ValidationPipe) params: EmailDto) {
    return this.authService.checkEmail(params);
  }
}
