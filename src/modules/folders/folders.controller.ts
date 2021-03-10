import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { CreateFoldersDto } from './dto/create-folders.dto';
import { UpdateFoldersDto } from './dto/update-folders.dto';
import { FoldersHttpService } from './folders.http.service';

@ApiBearerAuth()
@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly filesHttpService: FoldersHttpService) {}

  @ApiOperation({
    summary: 'create folder in main folder, folderId is optional',
  })
  @Post()
  create(@GetUser() user, @Body() createFolderDto: CreateFoldersDto) {
    return this.filesHttpService.create(user.id, createFolderDto);
  }

  @ApiOperation({ summary: 'update specific folder by id' })
  @Put(':id')
  updateById(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFolderDto: UpdateFoldersDto,
  ) {
    return this.filesHttpService.updateById(user.id, id, updateFolderDto);
  }

  @ApiOperation({ summary: 'get all folders this user' })
  @Get()
  getAll(@GetUser() user) {
    return this.filesHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get all files from specific folder this user' })
  @Get(':id')
  getOne(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.getById(user.id, id);
  }

  @ApiOperation({ summary: 'delete specific folder by id' })
  @Delete(':id')
  deleteById(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.deleteById(user.id, id);
  }
}
