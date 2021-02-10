import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { Questions } from '../question/entities/question.entity';
import { Answers } from './entities/answers.entity';
import { Users } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Answers, Users])],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
