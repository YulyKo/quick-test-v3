import { HttpCode } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';

import { CreateTestsDto } from './dto/create-tests.dto';
import { UpdateTestsDto } from './dto/update-tests.dto';
import { TestsHttpService } from './tests.http.service';

@ApiTags('test')
@ApiBearerAuth()
@Controller('tests')
export class TestController {
  constructor(private readonly testsHttpService: TestsHttpService) {}

  @ApiOperation({ summary: 'create test' })
  @Post()
  create(@GetUser() user, @Body() createTestsDto: CreateTestsDto) {
    return this.testsHttpService.create(user.id, createTestsDto);
  }

  @ApiOperation({ summary: 'add question in test' })
  @HttpCode(200)
  @Post(':id/questions/:questionId')
  addQuestion(
    @GetUser() user,
    @Param('id') testId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.testsHttpService.addQuestion(user.id, testId, questionId);
  }

  @ApiOperation({ summary: 'remove question from test' })
  @Delete(':id/questions/:questionId')
  removeQuestion(
    @GetUser() user,
    @Param('id') testId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.testsHttpService.removeQuestion(user.id, testId, questionId);
  }

  @Get()
  getAll(@GetUser() user) {
    return this.testsHttpService.getAll(user.id);
  }

  @Get(':id')
  getOne(@GetUser() user, @Param('id') id: string) {
    return this.testsHttpService.getOne(user.id, id);
  }

  @Put(':id')
  update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() updateTestDto: UpdateTestsDto,
  ) {
    return this.testsHttpService.updateById(user.id, id, updateTestDto);
  }

  @Delete(':id')
  delete(@GetUser() user, @Param('id') id: string) {
    return this.testsHttpService.deleteById(user.id, id);
  }
}
