import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsHttpService } from './questions.http.service';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Questions } from './entities/questions.entity';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Questions]), FoldersModule],
  controllers: [QuestionsController],
  providers: [QuestionsHttpService, QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
