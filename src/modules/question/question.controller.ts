import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetUser } from '../auth/get-user.decorator';
import { QuestionHttpService } from './question.http.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionHttpService: QuestionHttpService) {}

  @Post()
  create(@GetUser() user, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionHttpService.create(user.id, createQuestionDto);
  }

  @Get()
  findAll(@GetUser() user) {
    return this.questionHttpService.findAll(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.findOne(user.id, id);
  }

  @Put(':id')
  update(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionHttpService.update(user.id, id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.deleteOne(user.id, id);
  }
}
