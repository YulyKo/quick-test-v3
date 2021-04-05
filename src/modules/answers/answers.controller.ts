import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { AnswersHttpService } from './answers.http.service';
import { CreateAnswersDto } from './dto/create-answers.dto';
import { UpdateAnswersDto } from './dto/update-answers.dto';

@ApiTags('answers')
@ApiBearerAuth()
@Controller('questions/:questionId/answers')
export class AnswersController {
  constructor(private readonly answersHttpService: AnswersHttpService) {}

  @ApiOperation({ summary: 'get all answers in question this user' })
  @Get()
  getAll(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
  ) {
    return this.answersHttpService.getAll(user.id, questionId);
  }

  @ApiOperation({ summary: 'get answer in question this user' })
  @Get(':id')
  getOne(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answersHttpService.getById(user.id, questionId, id);
  }

  @ApiOperation({ summary: 'create answer' })
  @Post()
  create(
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

  @ApiOperation({ summary: 'update answer' })
  @Put(':id')
  updateById(
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
  @Delete(':id')
  deleteById(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answersHttpService.deleteById(user.id, questionId, id);
  }
}
