import { Injectable } from '@nestjs/common';
import { FoldersService } from '../folders/folders.service';
import { QuestionService } from '../question/question.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly questionService: QuestionService,
  ) {}

  async getById(user_id: string, id: string) {
    // get folders
    const files = await this.foldersService.getAllById(user_id, id);
    return {
      folders: files.children,
      question: files.questions,
    };
    // get questions
  }
}
