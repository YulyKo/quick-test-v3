import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoldersModule } from '../folders/folders.module';
import { QuestionsModule } from '../questions/questions.module';
import { CodeModule } from '../code/code.module';
import { TestController } from './tests.controller';
import { Tests } from './entities/tests.entity';
import { TestsHttpService } from './tests.http.service';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tests]),
    FoldersModule,
    QuestionsModule,
    CodeModule,
  ],
  controllers: [TestController],
  providers: [TestsHttpService, TestsService],
})
export class TestModule {}
