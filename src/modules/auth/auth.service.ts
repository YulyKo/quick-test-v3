import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/loginDto';
import { RegistrationDto } from './dto/registrationDto';
import { EmailDto } from './dto/emailDto';
import { FoldersService } from '../folders/folders.service';
import { config } from 'src/config';
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
    const payload = { username: user.name, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
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
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
