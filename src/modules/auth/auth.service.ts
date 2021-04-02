import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/loginDto';
import { RegistrationDto } from './dto/registrationDto';
import { EmailDto } from './dto/emailDto';
import { FoldersService } from '../folders/folders.service';
import { config } from '../../config';
import { UsersError } from '../users/users.error';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private foldersService: FoldersService,
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

    const tokens = await this.getValidTokens(user.name, user.id);

    return tokens;
  }

  public async refreshToken(userId, username, authorization) {
    const refreshToken = authorization.split(' ')[1];
    const isMatching = await this.isUserRefreshToken(userId, refreshToken);
    if (!isMatching) {
      throw new HttpException(
        'Refresh token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getValidTokens(username, userId);

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

  public async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      const isPasswordMatching = await bcrypt.compare(password, user.hash);
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      delete user.hash;
      delete user.refreshToken;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getValidTokens(username: string, sub: string) {
    const payload = { username, sub };

    const accessToken: string = this.jwtService.sign(payload, {
      secret: config.env.JWT_ACCESS_SECRET,
      expiresIn: config.env.JWT_ACCESS_EXPIRATION_TIME,
    });

    const refreshToken: string = this.jwtService.sign(payload, {
      secret: config.env.JWT_REFRESH_SECRET,
      expiresIn: config.env.JWT_REFRESH_EXPIRATION_TIME,
    });

    const refreshTokenSignature = this.getTokenSignature(refreshToken);

    const refreshTokenSignatureHashed = await bcrypt.hash(
      refreshTokenSignature,
      10,
    );
    await this.usersService.setCurrentRefreshToken(
      refreshTokenSignatureHashed,
      sub,
    );

    return { accessToken, refreshToken, userId: sub };
  }

  public async isUserRefreshToken(userId, token): Promise<boolean> {
    const user = await this.usersService.getById(userId);

    if (!user.refreshToken) {
      return false;
    }

    const refreshTokenSignature = this.getTokenSignature(token);

    const isMatching = await bcrypt.compare(
      refreshTokenSignature,
      user.refreshToken,
    );
    return isMatching;
  }

  public getTokenSignature(token: string) {
    return token.slice(token.lastIndexOf('.') + 1);
  }
}
