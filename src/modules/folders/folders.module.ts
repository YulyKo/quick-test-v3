import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folders } from './entities/folders.entity';
import { FoldersController } from './folders.controller';
import { FoldersHttpService } from './folders.http.service';
import { FoldersService } from './folders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Folders])],
  controllers: [FoldersController],
  providers: [FoldersHttpService, FoldersService],
  exports: [FoldersService],
})
export class FoldersModule {}
