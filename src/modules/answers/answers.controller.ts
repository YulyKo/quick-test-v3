import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { AnswersHttpService } from './answers.http.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('question/:questionId/answers')
export class AnswersController {
  constructor(private readonly answerHttpService: AnswersHttpService) {}

  @Get()
  findAll(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
  ) {
    return this.answerHttpService.findAll(user.id, question_id);
  }

  @Get(':id')
  findOne(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.findOne(user.id, question_id, id);
  }

  @Post()
  create(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerHttpService.create(user.id, question_id, createAnswerDto);
  }

  @Put(':id')
  update(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerHttpService.update(
      user.id,
      question_id,
      id,
      updateAnswerDto,
    );
  }

  @Delete(':id')
  delete(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.deleteOne(user.id, question_id, id);
  }
}
