import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Questions } from './question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
