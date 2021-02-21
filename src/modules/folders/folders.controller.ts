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
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FoldersHttpService } from './folders.http.service';

@ApiBearerAuth()
@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly filesHttpService: FoldersHttpService) {}

  @ApiOperation({
    summary: 'create folder in main folder, folder_id is optional',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: [
        {
          message: 'folder successful created',
          id: 'uuid',
        },
      ],
    },
  })
  @Post()
  create(@GetUser() user, @Body() createFolderDto: CreateFolderDto) {
    return this.filesHttpService.create(user.id, createFolderDto);
  }

  @ApiOperation({ summary: 'update specific folder by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          message: 'folder successful updated',
          id: 'uuid',
        },
      ],
    },
  })
  @Put(':id')
  updateById(
    @GetUser() user,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.filesHttpService.update(user.id, id, updateFolderDto);
  }

  @ApiOperation({ summary: 'get all folders this user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'string',
          color: 'hex',
          created: 'timestamptz',
          updated: 'timestamptz',
          parent: {
            id: 'id parent uuid',
          },
        },
      ],
    },
  })
  @Get()
  getAll(@GetUser() user) {
    return this.filesHttpService.getAll(user.id);
  }

  @ApiOperation({ summary: 'get all files from specific folder this user' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'string',
          color: 'hex',
          created: 'timestamptz',
          updated: 'timestamptz',
          parent: {
            id: 'id parent uuid',
          },
        },
      ],
    },
  })
  @Get(':id')
  getById(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.getById(user.id, id);
  }

  @ApiOperation({ summary: 'delete specific folder by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          message: 'folder successful deleted',
          id: 'uuid',
        },
      ],
    },
  })
  @Delete(':id')
  deleteById(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.deleteById(user.id, id);
  }
}
