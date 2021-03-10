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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { AnswersHttpService } from './answers.http.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@ApiTags('answers')
@ApiBearerAuth()
@Controller('questions/:questionId/answers')
export class AnswersController {
  constructor(private readonly answerHttpService: AnswersHttpService) {}

  @ApiOperation({ summary: 'get all answers in question this user' })
  @Get()
  getAll(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
  ) {
    return this.answerHttpService.getAll(user.id, questionId);
  }

  @ApiOperation({ summary: 'get answer in question this user' })
  @Get(':id')
  getOne(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.getById(user.id, questionId, id);
  }

  @ApiOperation({ summary: 'create answer' })
  @Post()
  create(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerHttpService.create(user.id, questionId, createAnswerDto);
  }

  @ApiOperation({ summary: 'update answer' })
  @Put(':id')
  updateById(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerHttpService.updateById(
      user.id,
      questionId,
      id,
      updateAnswerDto,
    );
  }

  @ApiOperation({ summary: 'delete answer by id' })
  @Delete(':id')
  deleteById(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.deleteById(user.id, questionId, id);
  }
}
