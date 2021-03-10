import { Exclude, Expose } from 'class-transformer';
import { ResponseFoldersDto } from 'src/modules/folders/dto/response-folders.dto';
import { ResponseQuestionsDto } from 'src/modules/questions/dto/response-questions.dto';
import { ResponseTestDto } from 'src/modules/test/dto/response-test.dto';

@Exclude()
export class ResponseFilesDto {
  @Expose({ name: 'children' })
  folders: ResponseFoldersDto[];

  @Expose()
  questions: ResponseQuestionsDto[];

  @Expose()
  test: ResponseTestDto[];
}
