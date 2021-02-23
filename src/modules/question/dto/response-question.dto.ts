import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { config } from 'src/config';
import { ResponseAnswersDto } from 'src/modules/answers/dto/response-answer.dto';
import {
  QuestionAnswerType,
  QuestionTemplate,
} from '../entities/question.entity';

@Exclude()
export class ResponseQuestionDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  @MinLength(config.constants.question.name.min)
  @MaxLength(config.constants.question.name.max)
  name: string;

  @Expose()
  @IsString()
  @MinLength(config.constants.question.text.min)
  @MaxLength(config.constants.question.text.max)
  text: string;

  @Expose()
  @IsNumber()
  @Min(config.constants.question.time.min)
  @Max(config.constants.question.time.max)
  time: number;

  @Expose()
  @IsUUID()
  @Transform((value) => value.obj.folder.id, { toClassOnly: true })
  folder_id: string;

  @Expose()
  @IsEnum(QuestionTemplate)
  template: QuestionTemplate;

  @Expose()
  @IsEnum(QuestionAnswerType)
  answer_type: QuestionAnswerType;

  @Expose()
  @Type(() => ResponseAnswersDto)
  answers: ResponseAnswersDto[];

  @Expose()
  @IsDate()
  created: Date;

  @Expose()
  @IsDate()
  updated: Date;
}
