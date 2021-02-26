import { Exclude, Expose } from 'class-transformer';
import { ResponseFolderDto } from 'src/modules/folders/dto/response-folder.dto';
import { ResponseQuestionDto } from 'src/modules/question/dto/response-question.dto';

@Exclude()
export class ResponseFilesDto {
  @Expose({ name: 'children' })
  folders: ResponseFolderDto[];

  @Expose()
  questions: ResponseQuestionDto[];
}
