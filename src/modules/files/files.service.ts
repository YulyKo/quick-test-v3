import { Injectable } from '@nestjs/common';
import { FoldersService } from '../folders/folders.service';
import { QuestionService } from '../question/question.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly questionService: QuestionService,
  ) {}

  async getFromMain(id: string) {
    // get folders
    const files = await this.foldersService.getById(id, id);
    // get questions
  }
}
