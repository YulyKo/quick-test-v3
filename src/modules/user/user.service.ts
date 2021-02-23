import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUserDto';
import { Users } from './entities/user.entity';
import { UserError } from './user.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async isFreeEmail(email: string) {
    const userWithEmail = await this.userRepository.find({ email });
    if (userWithEmail.length) {
      return false;
    }
    return true;
  }

  async create(userData: CreateUserDto) {
    const emailIsFree = await this.isFreeEmail(userData.email);
    if (!emailIsFree)
      throw new UserError('User with this email has already existed');
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
