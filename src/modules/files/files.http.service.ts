import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FoldersError } from '../folders/folders.error';
import { ResponseFilesDto } from './dto/response-files.dto';
import { FilesService } from './files.service';

@Injectable()
export class FilesHttpService {
  constructor(private readonly filesService: FilesService) {}

  async getFromMain(id: string) {
    try {
      const files = await this.filesService.getById(id, id);
      return plainToClass(ResponseFilesDto, files);
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getFromFolder(user_id: string, id: string) {
    try {
      const files = await this.filesService.getById(user_id, id);
      return plainToClass(ResponseFilesDto, files);
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
