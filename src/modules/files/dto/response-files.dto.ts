import { Exclude, Expose } from 'class-transformer';
import { ResponseFoldersDto } from '../../folders/dto/response-folders.dto';
import { ResponseQuestionsDto } from '../../questions/dto/response-questions.dto';
import { ResponseTestsDto } from '../../tests/dto/response-tests.dto';

@Exclude()
export class ResponseFilesDto {
  @Expose({ name: 'children' })
  folders: ResponseFoldersDto[];

  @Expose()
  questions: ResponseQuestionsDto[];

  @Expose()
  tests: ResponseTestsDto[];
}
