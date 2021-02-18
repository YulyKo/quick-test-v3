import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesHttpService {
  constructor(private readonly filesService: FilesService) {}

  async getFromMain(id: string) {
    try {
      const files = await this.filesService.getFromMain(id);

      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
