import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateQuestionsDto } from './dto/create-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { GetUser } from '../auth/get-user.decorator';
import { QuestionsHttpService } from './services/questions.http.service';
import { AnswersHttpService } from './services/answers.http.service';
import { CreateAnswersDto } from './dto/create-answers.dto';
import { UpdateAnswersDto } from './dto/update-answers.dto';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsHttpService: QuestionsHttpService,
    private readonly answersHttpService: AnswersHttpService,
  ) {}

  @ApiOperation({ summary: 'create question' })
  @Post()
  create(
    @GetUser() user,
    @Body(new ParseArrayPipe({ items: CreateQuestionsDto }))
    createQuestionDto: CreateQuestionsDto[],
  ) {
    return this.questionsHttpService.create(user.id, createQuestionDto);
  }

  @ApiOperation({ summary: 'get all question this user' })
  @Get()
  getAll(@GetUser() user) {
    return this.questionsHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get question by id this user' })
  @Get(':id')
  getOne(@GetUser() user, @Param('id') id: string) {
    return this.questionsHttpService.getById(user.id, id);
  }

  @ApiOperation({ summary: 'update question' })
  @Put(':id')
  update(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateQuestionsDto: UpdateQuestionsDto,
  ) {
    return this.questionsHttpService.updateById(
      user.id,
      id,
      updateQuestionsDto,
    );
  }

  @ApiOperation({ summary: 'delete question by id' })
  @Delete(':id')
  delete(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionsHttpService.deleteById(user.id, id);
  }

  // Answers

  @ApiOperation({ summary: 'create answer' })
  @Post('/:questionId/answers')
  createAnswer(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Body(new ParseArrayPipe({ items: CreateAnswersDto }))
    createAnswerDtos: CreateAnswersDto[],
  ) {
    return this.answersHttpService.create(
      user.id,
      questionId,
      createAnswerDtos,
    );
  }

  @ApiOperation({ summary: 'get all answers in question this user' })
  @Get()
  getAllAnswers(
    @GetUser() user,
    @Param('/:questionId/answers', new ParseUUIDPipe()) questionId: string,
  ) {
    return this.answersHttpService.getAll(user.id, questionId);
  }

  @ApiOperation({ summary: 'get answer in question this user' })
  @Get('/:questionId/answers/:id')
  getOneAnswer(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answersHttpService.getById(user.id, questionId, id);
  }

  @ApiOperation({ summary: 'update answer' })
  @Put('/:questionId/answers/:id')
  updateAnswerById(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnswerDto: UpdateAnswersDto,
  ) {
    return this.answersHttpService.updateById(
      user.id,
      questionId,
      id,
      updateAnswerDto,
    );
  }

  @ApiOperation({ summary: 'delete answer by id' })
  @Delete('/:questionId/answers/:id')
  deleteAnswerById(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answersHttpService.deleteById(user.id, questionId, id);
  }
}
