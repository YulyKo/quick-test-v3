import { ApiProperty } from '@nestjs/swagger';

import {
  QuestionAnswerType,
  QuestionTemplate,
} from '../entities/question.entity';

export class CreateQuestionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  parent_id?: string;

  @ApiProperty()
  template: QuestionTemplate;

  @ApiProperty()
  answer_type: QuestionAnswerType;

  @ApiProperty()
  folder_id?: string;
}
