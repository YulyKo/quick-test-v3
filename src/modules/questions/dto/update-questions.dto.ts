import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { config } from '../../../config';
import {
  QuestionsAnswerType,
  QuestionsTemplate,
} from '../entities/questions.entity';

export class UpdateQuestionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(config.constants.question.name.min)
  @MaxLength(config.constants.question.name.max)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(config.constants.question.text.min)
  @MaxLength(config.constants.question.text.max)
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(config.constants.question.time.min)
  @Max(config.constants.question.time.max)
  time?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(QuestionsTemplate)
  template?: QuestionsTemplate;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(QuestionsAnswerType)
  answerType?: QuestionsAnswerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  folderId?: string;
}
