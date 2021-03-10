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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateQuestionsDto } from './dto/create-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { GetUser } from '../auth/get-user.decorator';
import { QuestionsHttpService } from './questions.http.service';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsHttpService: QuestionsHttpService) {}

  @ApiOperation({ summary: 'create question' })
  @Post()
  create(@GetUser() user, @Body() createQuestionDto: CreateQuestionsDto) {
    return this.questionsHttpService.create(user.id, createQuestionDto);
  }

  @ApiOperation({ summary: 'get all question this user' })
  @Get()
  getAll(@GetUser() user) {
    return this.questionsHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get question by id this user' })
  @Get(':id')
  getOne(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
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
}
