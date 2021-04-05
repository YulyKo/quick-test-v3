import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateQuestionsDto {
  @ApiProperty()
  @IsString()
  @MinLength(config.constants.question.name.min)
  @MaxLength(config.constants.question.name.max)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(config.constants.question.text.min)
  @MaxLength(config.constants.question.text.max)
  text: string;

  @ApiProperty()
  @IsNumber()
  @Min(config.constants.question.time.min)
  @Max(config.constants.question.time.max)
  time: number;

  @ApiProperty()
  @IsEnum(QuestionsTemplate)
  template: QuestionsTemplate;

  @ApiProperty()
  @IsEnum(QuestionsAnswerType)
  answerType: QuestionsAnswerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  folderId?: string;
}
