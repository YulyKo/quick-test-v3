import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersDto } from './dto/createUsersDto';
import { Users } from './entities/users.entity';
import { UsersError } from './users.error';

@Injectable()
export class UsersService {
  constructor(
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
      HttpStatus.NOT_FOUND,
    );
  }
}
