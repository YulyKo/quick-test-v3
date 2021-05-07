import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CodeService } from '../code/code.service';
import { CreateUsersDto } from './dto/createUsersDto';
import { Users } from './entities/users.entity';
import { UsersError } from './users.error';

@Injectable()
export class UsersService {
  constructor(
    private readonly codeService: CodeService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async isFreeEmail(email: string) {
    const userWithEmail = await this.usersRepository.find({ email });
    if (userWithEmail.length) {
      return false;
    }
    return true;
  }

  async create(userData: CreateUsersDto) {
    const emailIsFree = await this.isFreeEmail(userData.email);
    if (!emailIsFree)
      throw new UsersError('User with this email has already existed');
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    await this.usersRepository.update(userId, {
      refreshToken,
    });
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  getCode() {
    return this.codeService.getUniqCode(this.usersRepository);
  }

  async saveCode(id: string, code: string) {
    await this.usersRepository.update(id, {
      code,
      codeCreatedAt: new Date(),
    });
  }

  async updatePassword(id: string, hash: string) {
    await this.usersRepository.update(id, {
      hash,
      refreshToken: null,
      code: null,
      codeCreatedAt: null,
    });
  }
}
