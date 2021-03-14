import { Exclude, Expose } from 'class-transformer';
import { ResponseFoldersDto } from 'src/modules/folders/dto/response-folders.dto';
import { ResponseQuestionsDto } from 'src/modules/questions/dto/response-questions.dto';
import { ResponseTestsDto } from 'src/modules/tests/dto/response-tests.dto';

@Exclude()
export class ResponseFilesDto {
  @Expose({ name: 'children' })
  folders: ResponseFoldersDto[];

  @Expose()
  questions: ResponseQuestionsDto[];

  @Expose()
  tests: ResponseTestsDto[];
}
