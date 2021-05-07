import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoldersModule } from '../folders/folders.module';
import { QuestionsModule } from '../questions/questions.module';
import { CodeModule } from '../code/code.module';
import { StorageModule } from '../storage/storage.module';
import { TestController } from './tests.controller';
import { Tests } from './entities/tests.entity';
import { TestsHttpService } from './tests.http.service';
import { TestsService } from './tests.service';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';
import { TestsGateway } from './tests.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tests]),
    FoldersModule,
    QuestionsModule,
    CodeModule,
    StorageModule,
    JwtTokenModule,
  ],
  controllers: [TestController],
  providers: [TestsHttpService, TestsService, TestsGateway],
})
export class TestModule {}
