import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { config } from 'src/config';
import { ResponseQuestionsDto } from 'src/modules/questions/dto/response-questions.dto';

@Exclude()
export class ResponseTestDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  @MinLength(config.constants.test.name.min)
  @MaxLength(config.constants.test.name.max)
  name: string;

  @Expose()
  @IsString()
  @MinLength(config.constants.test.text.min)
  @MaxLength(config.constants.test.text.max)
  text: string;

  @Expose()
  @IsString()
  @Length(config.constants.test.code.length)
  code: string;

  @Expose()
  @IsBoolean()
  is_open: boolean;

  @Expose()
  @IsUUID()
  @Transform((value) => value.obj.folder.id, { toClassOnly: true })
  folder_id: string;

  @Expose()
  @Type(() => ResponseQuestionsDto)
  questions: ResponseQuestionsDto[];
}
