import { Injectable } from '@nestjs/common';
import { FoldersService } from '../folders/folders.service';

@Injectable()
export class FilesService {
  constructor(private readonly foldersService: FoldersService) {}

  async getById(user_id: string, id: string) {
    const files = await this.foldersService.getAllById(user_id, id);
    return files;
  }
}
