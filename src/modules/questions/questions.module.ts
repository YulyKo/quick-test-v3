import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsHttpService } from './services/questions.http.service';
import { QuestionsService } from './services/questions.service';
import { QuestionsController } from './questions.controller';
import { Questions } from './entities/questions.entity';
import { FoldersModule } from '../folders/folders.module';
import { AnswersHttpService } from './services/answers.http.service';
import { AnswersService } from './services/answers.service';
import { Answers } from './entities/answers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Answers]), FoldersModule],
  controllers: [QuestionsController],
  providers: [
    QuestionsHttpService,
    QuestionsService,
    AnswersHttpService,
    AnswersService,
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
