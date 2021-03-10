import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dto/loginDto';
import { RegistrationDto } from './dto/registrationDto';
import { EmailDto } from './dto/emailDto';
import { FoldersService } from '../folders/folders.service';
import { config } from 'src/config';
import { UserError } from '../user/user.error';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private folderService: FoldersService,
  ) {}

  public async checkEmail(params: EmailDto) {
    const isFree: boolean = await this.userService.isFreeEmail(params.email);
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
      const createdUser = await this.userService.create({
        ...credentials,
        hash,
      });
      delete createdUser.hash;
      delete createdUser.current_hashed_refresh_token_signature;
      await this.folderService.create(
        createdUser.id,
        config.constants.default.folder,
        true,
      );
      return createdUser;
    } catch (error) {
      if (error instanceof UserError)
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

    const tokens = await this.saveRefreshAndGetBothTokens(user.name, user.id);

    return tokens;
  }

  public async refreshToken(user_id, username, authorization_header) {
    const refresh_token = authorization_header.replace('Bearer ', '');
    const isRefreshTokenMatching = await this.isUserRefreshToken(
      user_id,
      refresh_token,
    );
    if (!isRefreshTokenMatching) {
      throw new HttpException(
        'Refresh token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.saveRefreshAndGetBothTokens(username, user_id);

    return tokens;
  }

  public async logout(user_id, authorization_header) {
    const refresh_token = authorization_header.replace('Bearer ', '');
    const isRefreshTokenMatching = await this.isUserRefreshToken(
      user_id,
      refresh_token,
    );
    if (!isRefreshTokenMatching) {
      throw new HttpException(
        'Refresh token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.setCurrentRefreshToken(null, user_id);

    return { message: 'OK' };
  }

  public async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      const isPasswordMatching = await bcrypt.compare(password, user.hash);
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      delete user.hash;
      delete user.current_hashed_refresh_token_signature;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async saveRefreshAndGetBothTokens(
    username: string,
    sub: string,
  ): Promise<{ access_token; refresh_token }> {
    const payload = { username, sub };

    const access_token = this.jwtService.sign(payload, {
      secret: config.env.JWT_ACCESS_SECRET,
      expiresIn: config.env.JWT_ACCESS_EXPIRATION_TIME,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: config.env.JWT_REFRESH_SECRET,
      expiresIn: config.env.JWT_REFRESH_EXPIRATION_TIME,
    });

    const refresh_token_signature = this.getTokenSignature(refresh_token);

    const current_hashed_refresh_token_signature = await bcrypt.hash(
      refresh_token_signature,
      10,
    );
    await this.userService.setCurrentRefreshToken(
      current_hashed_refresh_token_signature,
      sub,
    );

    return { access_token, refresh_token };
  }

  public async isUserRefreshToken(user_id, token): Promise<boolean> {
    const user = await this.userService.getById(user_id);

    if (!user.current_hashed_refresh_token_signature) {
      return false;
    }

    const refresh_token_signature = this.getTokenSignature(token);

    const isRefreshTokenMatching = await bcrypt.compare(
      refresh_token_signature,
      user.current_hashed_refresh_token_signature,
    );
    return isRefreshTokenMatching;
  }

  public getTokenSignature(token: string) {
    return token.slice(token.lastIndexOf('.') + 1);
  }
}
