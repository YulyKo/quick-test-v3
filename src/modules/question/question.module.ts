import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionHttpService } from './question.http.service';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Questions } from './entities/question.entity';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Questions]), FoldersModule],
  controllers: [QuestionController],
  providers: [QuestionHttpService, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
