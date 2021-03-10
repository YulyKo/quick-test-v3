import { ApiPropertyOptional } from '@nestjs/swagger';
import {
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
import {
  QuestionsAnswerType,
  QuestionsTemplate,
} from '../entities/questions.entity';

export class UpdateQuestionsDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(config.constants.question.name.min)
  @MaxLength(config.constants.question.name.max)
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(config.constants.question.text.min)
  @MaxLength(config.constants.question.text.max)
  text?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(config.constants.question.time.min)
  @Max(config.constants.question.time.max)
  time?: number;

  @ApiPropertyOptional()
  @IsEnum(QuestionsTemplate)
  template?: QuestionsTemplate;

  @ApiPropertyOptional()
  @IsEnum(QuestionsAnswerType)
  answerType?: QuestionsAnswerType;

  @ApiPropertyOptional()
  @IsUUID()
  folderId?: string;
}
