import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestController } from './tests.controller';
import { FoldersModule } from '../folders/folders.module';
import { Tests } from './entities/tests.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from '../questions/questions.module';
import { TestsHttpService } from './tests.http.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tests]), FoldersModule, QuestionsModule],
  controllers: [TestController],
  providers: [TestsHttpService, TestsService],
})
export class TestModule {}
