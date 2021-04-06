import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersHttpService } from './answers.http.service';
import { Answers } from './entities/answers.entity';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answers]),
    forwardRef(() => QuestionsModule),
  ],
  controllers: [AnswersController],
  providers: [AnswersHttpService, AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
