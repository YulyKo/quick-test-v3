import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
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
import { IsValidCodeDto } from './dto/isValidCodeDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto';
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
        accessToken: 'some accessToken',
        refreshToken: 'some refreshToken',
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
    return this.authService.refresh(user.id, user.name, authorization);
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

  @ApiOperation({ summary: 'check is code valid' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Code is incorrect or expired',
  })
  @Head('email/:email/code/:code')
  async isValidCode(@Param(ValidationPipe) params: IsValidCodeDto) {
    return this.authService.isValidCode(params);
  }

  @ApiOperation({ summary: 'change user password if code valid' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @Put('password/change')
  async changePassword(@Body(ValidationPipe) credentials: ChangePasswordDto) {
    return this.authService.changePassword(credentials);
  }

  @ApiOperation({ summary: 'forgot user password' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @Patch('password/forgot')
  async forgotPassword(@Body(ValidationPipe) credentials: ForgotPasswordDto) {
    return this.authService.forgotPassword(credentials);
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
