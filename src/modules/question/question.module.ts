import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionHttpService } from './question.http.service';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Questions } from './entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  controllers: [QuestionController],
  providers: [QuestionHttpService, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
