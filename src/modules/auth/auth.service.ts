import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/loginDto';
import { RegistrationDto } from './dto/registrationDto';
import { EmailDto } from './dto/emailDto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { IsValidCodeDto } from './dto/isValidCodeDto';
import { FoldersService } from '../folders/folders.service';
import { config } from '../../config';
import { MailService } from '../mail/mail.service';
import { CodeService } from '../code/code.service';
import { UsersError } from '../users/users.error';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { JwtOptions } from '../jwt-token/jwt-body.interface';
import { JwtTokenService } from '../jwt-token/jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtTokenService,
    private foldersService: FoldersService,
    private mailService: MailService,
    private codeService: CodeService,
  ) {}

  public async checkEmail(params: EmailDto) {
    const isFree: boolean = await this.usersService.isFreeEmail(params.email);
    if (isFree) {
      return true;
    } else {
      throw new HttpException(
        'this email has already existed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async registration(credentials: RegistrationDto) {
    const hash = await bcrypt.hash(credentials.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...credentials,
        hash,
      });
      delete createdUser.hash;
      delete createdUser.refreshToken;
      delete createdUser.code;
      delete createdUser.codeCreatedAt;
      await this.foldersService.create(
        createdUser.id,
        config.constants.default.folder,
        true,
      );
      return createdUser;
    } catch (error) {
      if (error instanceof UsersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(credentials: LoginDto) {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );

    const tokens = await this.getValidTokens(user.id);

    return tokens;
  }

  public async refresh(userId, authorization) {
    const refreshToken = authorization.split(' ')[1];
    const isMatching = await this.isUserRefreshToken(userId, refreshToken);
    if (!isMatching) {
      throw new HttpException(
        'Refresh token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getValidTokens(userId);

    return tokens;
  }

  public async logout(userId, authorization) {
    const refreshToken = authorization.split(' ')[1];
    const isMatching = await this.isUserRefreshToken(userId, refreshToken);
    if (!isMatching) {
      throw new HttpException(
        'Refresh token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.usersService.setCurrentRefreshToken(null, userId);

    return { message: 'OK' };
  }

  public async isValidCode(params: IsValidCodeDto) {
    await this.validateUserByCode(params.email, params.code);

    return true;
  }

  public async changePassword(credentials: ChangePasswordDto) {
    const user = await this.validateUserByCode(
      credentials.email,
      credentials.code,
    );

    const isPasswordMatching = await bcrypt.compare(
      credentials.password,
      user.hash,
    );
    if (isPasswordMatching) {
      throw new HttpException('Input new password', HttpStatus.BAD_REQUEST);
    }

    const hash = await bcrypt.hash(credentials.password, 10);
    await this.usersService.updatePassword(user.id, hash);

    return true;
  }

  public async forgotPassword(credentials: ForgotPasswordDto) {
    const user = await this.usersService.getByEmail(credentials.email);

    const code = await this.usersService.getCode();
    const codeHash = await bcrypt.hash(code, 10);
    await this.usersService.saveCode(user.id, codeHash);

    await this.mailService.forgotPassword({
      name: user.name,
      email: credentials.email,
      code,
    });

    return true;
  }

  private async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      const isPasswordMatching = await bcrypt.compare(password, user.hash);
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getValidTokens(id: string): Promise<LoginResponseDto> {
    const accessTokenOptions: JwtOptions = {
      secret: config.env.JWT_ACCESS_SECRET,
      expiresIn: config.env.JWT_ACCESS_EXPIRATION_TIME,
    };
    const refreshTokenOptions: JwtOptions = {
      secret: config.env.JWT_REFRESH_SECRET,
      expiresIn: config.env.JWT_REFRESH_EXPIRATION_TIME,
    };

    const accessToken = this.jwtTokenService.generate(
      { id },
      accessTokenOptions,
    );

    const refreshToken = this.jwtTokenService.generate(
      { id },
      refreshTokenOptions,
    );

    const refreshTokenSignature = this.jwtTokenService.getSignature(
      refreshToken,
    );
    const refreshTokenSignatureHashed = await bcrypt.hash(
      refreshTokenSignature,
      10,
    );
    await this.usersService.setCurrentRefreshToken(
      refreshTokenSignatureHashed,
      id,
    );

    return { accessToken, refreshToken, userId: id };
  }

  private async isUserRefreshToken(userId, token): Promise<boolean> {
    const user = await this.usersService.getById(userId);

    if (!user.refreshToken) {
      return false;
    }

    const refreshTokenSignature = this.jwtTokenService.getSignature(token);

    const isMatching = await bcrypt.compare(
      refreshTokenSignature,
      user.refreshToken,
    );
    return isMatching;
  }

  private async validateUserByCode(email, code) {
    const user = await this.usersService.getByEmail(email);
    if (!user.code || !user.codeCreatedAt) {
      throw new HttpException('First send code', HttpStatus.BAD_REQUEST);
    }
    const codeLive = Date.now() - Date.parse(user.codeCreatedAt.toString());
    const isCode = await bcrypt.compare(code, user.code);

    const isValid = isCode && codeLive < config.constants.auth.code.expiresIn;
    if (!isValid) {
      throw new HttpException(
        'Incorrect or expired code',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }
}
