import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesHttpService {
  constructor(private readonly filesService: FilesService) {}

  async getFromMain(id: string) {
    try {
      const files = await this.filesService.getById(id, id);

      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getFromFolder(user_id: string, id: string) {
    try {
      const files = await this.filesService.getById(user_id, id);

      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
