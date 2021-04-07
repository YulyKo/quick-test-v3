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
import { ResponseAnswersDto } from './response-answers.dto';

import { config } from '../../../config';
import {
  QuestionsAnswerType,
  QuestionsTemplate,
} from '../entities/questions.entity';

@Exclude()
export class ResponseQuestionsDto {
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
  folderId: string;

  @Expose()
  @IsEnum(QuestionsTemplate)
  template: QuestionsTemplate;

  @Expose()
  @IsEnum(QuestionsAnswerType)
  answerType: QuestionsAnswerType;

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
