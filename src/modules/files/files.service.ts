import { Injectable } from '@nestjs/common';
import { FoldersService } from '../folders/folders.service';

@Injectable()
export class FilesService {
  constructor(private readonly foldersService: FoldersService) {}

  async getById(userId: string, id: string) {
    const files = await this.foldersService.getAllById(userId, id);
    return files;
  }
}
