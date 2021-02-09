import { ApiProperty } from '@nestjs/swagger';

import {
  QuestionAnswerType,
  QuestionTemplate,
} from '../entities/question.entity';

import { CreateAnswerDto } from './create-answer.dto';

export class CreateQuestionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  template: QuestionTemplate;

  @ApiProperty()
  answer_type: QuestionAnswerType;

  @ApiProperty()
  answers: CreateAnswerDto[];
}
