import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { FoldersModule } from '../folders/folders.module';
import { Test } from './entities/test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from '../questions/questions.module';
import { TestHttpService } from './test.http.service';

@Module({
  imports: [TypeOrmModule.forFeature([Test]), FoldersModule, QuestionsModule],
  controllers: [TestController],
  providers: [TestHttpService, TestService],
})
export class TestModule {}
