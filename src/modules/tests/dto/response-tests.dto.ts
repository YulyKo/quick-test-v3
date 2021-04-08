import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { config } from '../../../config';
import { ResponseQuestionsDto } from '../../questions/dto/response-questions.dto';
import { IsCode } from '../../code/code.validator.decorator';

@Exclude()
export class ResponseTestsDto {
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
  @IsCode()
  code: string;

  @Expose()
  @IsBoolean()
  isOpen: boolean;

  @Expose()
  @IsUUID()
  @Transform((value) => value.obj.folder.id, { toClassOnly: true })
  folderId: string;

  @Expose()
  @Type(() => ResponseQuestionsDto)
  questions: ResponseQuestionsDto[];
}
