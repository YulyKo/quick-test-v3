import { ApiProperty } from '@nestjs/swagger';

import {
  QuestionAnswerType,
  QuestionTemplate,
} from '../entities/question.entity';

export class UpdateQuestionDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  text?: string;

  @ApiProperty()
  time?: number;

  @ApiProperty()
  template?: QuestionTemplate;

  @ApiProperty()
  answer_type?: QuestionAnswerType;
}
