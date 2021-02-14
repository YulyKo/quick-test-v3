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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionHttpService: QuestionHttpService) {}

  @ApiOperation({ summary: 'create question' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        id: 'uuid',
        created: 'timestamptz',
        message: 'question successfully created',
      },
    },
  })
  @Post()
  create(@GetUser() user, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionHttpService.create(user.id, createQuestionDto);
  }

  @ApiOperation({ summary: 'get all question this user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'name question',
          text: 'text question',
          time: 'integer seconds',
          template: 'boolean',
          answer_type: 'button|user_input',
          created: 'timestamptz',
          updated: 'timestamptz',
          answers: [],
        },
      ],
    },
  })
  @Get()
  findAll(@GetUser() user) {
    return this.questionHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get question by id this user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        name: 'name question',
        text: 'text question',
        time: 'integer seconds',
        template: 'boolean',
        answer_type: 'button|user_input',
        created: 'timestamptz',
        updated: 'timestamptz',
        answers: [],
      },
    },
  })
  @Get(':id')
  findOne(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.getById(user.id, id);
  }

  @ApiOperation({ summary: 'update question' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        updated: 'timestamptz',
        message: 'question successfully updated',
      },
    },
  })
  @Put(':id')
  update(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionHttpService.update(user.id, id, updateQuestionDto);
  }

  @ApiOperation({ summary: 'delete question by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        message: 'question successfully deleted',
      },
    },
  })
  @Delete(':id')
  remove(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionHttpService.deleteById(user.id, id);
  }
}
