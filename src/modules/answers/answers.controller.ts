import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { AnswersHttpService } from './answers.http.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('question/:questionId/answers')
export class AnswersController {
  constructor(private readonly answerHttpService: AnswersHttpService) {}

  @Get()
  findAll(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
  ) {
    return `question ${question_id}`;
  }

  @Get(':id')
  findOne(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return `question ${question_id} id ${id}`;
  }

  @Post()
  create(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerHttpService.create(user.id, question_id, createAnswerDto);
  }
}
