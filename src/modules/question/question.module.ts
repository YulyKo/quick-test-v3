import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Questions } from './entities/question.entity';
import { Answers } from './entities/answers.entity';
import { Users } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Answers, Users])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
