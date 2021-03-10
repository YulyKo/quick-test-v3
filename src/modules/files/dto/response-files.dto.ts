import { Exclude, Expose } from 'class-transformer';
import { ResponseFolderDto } from 'src/modules/folders/dto/response-folder.dto';
import { ResponseQuestionsDto } from 'src/modules/questions/dto/response-questions.dto';
import { ResponseTestDto } from 'src/modules/test/dto/response-test.dto';

@Exclude()
export class ResponseFilesDto {
  @Expose({ name: 'children' })
  folders: ResponseFolderDto[];

  @Expose()
  questions: ResponseQuestionsDto[];

  @Expose()
  test: ResponseTestDto[];
}
