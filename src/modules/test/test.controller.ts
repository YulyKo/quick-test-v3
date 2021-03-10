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

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestHttpService } from './test.http.service';

@ApiTags('test')
@ApiBearerAuth()
@Controller('tests')
export class TestController {
  constructor(private readonly testHttpService: TestHttpService) {}

  @ApiOperation({ summary: 'create test' })
  @Post()
  create(@GetUser() user, @Body() createTestDto: CreateTestDto) {
    return this.testHttpService.create(user.id, createTestDto);
  }

  @ApiOperation({ summary: 'add question in test' })
  @Post(':id/questions/:questionId')
  addQuestion(
    @GetUser() user,
    @Param('id') testId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.testHttpService.addQuestion(user.id, testId, questionId);
  }

  @ApiOperation({ summary: 'add question in test' })
  @Delete(':id/questions/:questionId')
  removeQuestion(
    @GetUser() user,
    @Param('id') testId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.testHttpService.removeQuestion(user.id, testId, questionId);
  }

  @Get()
  getAll(@GetUser() user) {
    return this.testHttpService.getAll(user.id);
  }

  @Get(':id')
  getOne(@GetUser() user, @Param('id') id: string) {
    return this.testHttpService.getOne(user.id, id);
  }

  @Put(':id')
  update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return this.testHttpService.updateById(user.id, id, updateTestDto);
  }

  @Delete(':id')
  delete(@GetUser() user, @Param('id') id: string) {
    return this.testHttpService.deleteById(user.id, id);
  }
}
