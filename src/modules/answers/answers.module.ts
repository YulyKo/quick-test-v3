import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersHttpService } from './answers.http.service';
import { Answers } from './entities/answers.entity';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answers]), QuestionModule],
  controllers: [AnswersController],
  providers: [AnswersHttpService, AnswersService],
})
export class AnswersModule {}
