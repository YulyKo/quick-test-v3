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

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetUser } from '../auth/get-user.decorator';
import { QuestionHttpService } from './question.http.service';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionHttpService: QuestionHttpService) {}

  @ApiOperation({ summary: 'create question' })
  @Post()
  create(@GetUser() user, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionHttpService.create(user.id, createQuestionDto);
  }

  @ApiOperation({ summary: 'get all question this user' })
  @Get()
  findAll(@GetUser() user) {
    return this.questionHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get question by id this user' })
  @Get(':id')
  findOne(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.getById(user.id, id);
  }

  @ApiOperation({ summary: 'update question' })
  @Put(':id')
  update(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionHttpService.update(user.id, id, updateQuestionDto);
  }

  @ApiOperation({ summary: 'delete question by id' })
  @Delete(':id')
  remove(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.deleteById(user.id, id);
  }
}
