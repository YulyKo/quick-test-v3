import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CodeModule } from '../code/code.module';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), CodeModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
