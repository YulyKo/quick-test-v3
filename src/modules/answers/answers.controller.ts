import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'name answer',
          is_true: 'boolean',
          created: 'timestamptz',
          updated: 'timestamptz',
        },
      ],
    },
  })
  @Get()
  findAll(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
  ) {
    return this.answerHttpService.getAll(user.id, question_id);
  }

  @ApiOperation({ summary: 'get answer in question this user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        name: 'name answer',
        is_true: 'boolean',
        created: 'timestamptz',
        updated: 'timestamptz',
      },
    },
  })
  @Get(':id')
  findOne(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.getById(user.id, question_id, id);
  }

  @ApiOperation({ summary: 'create answer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        id: 'uuid',
        created: 'timestamptz',
        message: 'answer successfully created',
      },
    },
  })
  @Post()
  create(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerHttpService.create(user.id, question_id, createAnswerDto);
  }

  @ApiOperation({ summary: 'update answer' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        updated: 'timestamptz',
        message: 'asnwer successfully updated',
      },
    },
  })
  @Put(':id')
  update(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerHttpService.updateById(
      user.id,
      question_id,
      id,
      updateAnswerDto,
    );
  }

  @ApiOperation({ summary: 'delete asnwer by id' })
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
  delete(
    @GetUser() user,
    @Param('questionId', new ParseUUIDPipe()) question_id: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.answerHttpService.deleteById(user.id, question_id, id);
  }
}
