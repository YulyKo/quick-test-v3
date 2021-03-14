import {
  Controller,
  Post,
  Get,
  ValidationPipe,
  Body,
  Head,
  Param,
  HttpStatus,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { EmailDto } from './dto/emailDto';
import { Public } from './auth.decorator';
import { GetUser } from './get-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from './jwt-auth.guard';

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
        accessToken: 'some access_token',
        refreshToken: 'some refresh_token',
      },
    },
  })
  @Post('login')
  @HttpCode(200)
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

  @ApiOperation({ summary: 'refresh tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        accessToken: 'some accessToken',
        refreshToken: 'some refreshToken',
      },
    },
  })
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@GetUser() user, @Headers('authorization') authorization) {
    return this.authService.refreshToken(user.id, user.name, authorization);
  }

  @ApiOperation({ summary: 'logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        message: 'OK',
      },
    },
  })
  @Get('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@GetUser() user, @Headers('authorization') authorization) {
    return this.authService.logout(user.id, authorization);
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
