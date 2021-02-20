import { Module } from '@nestjs/common';
import { FoldersModule } from '../folders/folders.module';
import { FilesController } from './files.controller';
import { FilesHttpService } from './files.http.service';
import { FilesService } from './files.service';

@Module({
  imports: [FoldersModule],
  controllers: [FilesController],
  providers: [FilesService, FilesHttpService],
})
export class FilesModule {}
