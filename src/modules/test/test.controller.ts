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

  @Get()
  getAll(@GetUser() user) {
    return this.testHttpService.getAll(user.id);
  }

  @Get(':id')
  getOne(@GetUser() user, @Param('id') id: string) {
    return this.testHttpService.getOne(user.id, id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testHttpService.updateById(id, updateTestDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.testHttpService.deleteById(id);
  }
}
