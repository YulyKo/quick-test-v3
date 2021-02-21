import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { FilesHttpService } from './files.http.service';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesHttpService: FilesHttpService) {}

  @ApiOperation({ summary: 'get all files from main page' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        folders: [
          {
            id: 'uuid',
            name: 'text',
            color: 'hex',
            updated: 'timestamptz',
            created: 'timestamptz',
          },
        ],
        questions: [
          {
            id: 'uuid',
            name: 'text',
            answer_type: 'button|user_input',
            created: 'timestamptz',
            updated: 'timestamptz',
          },
        ],
      },
    },
  })
  @Get()
  getFromMain(@GetUser() user) {
    return this.filesHttpService.getFromMain(user.id);
  }

  @ApiOperation({ summary: 'get all files from specific page' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        folders: [
          {
            id: 'uuid',
            name: 'text',
            color: 'hex',
            updated: 'timestamptz',
            created: 'timestamptz',
          },
        ],
        questions: [
          {
            id: 'uuid',
            name: 'text',
            answer_type: 'button|user_input',
            created: 'timestamptz',
            updated: 'timestamptz',
          },
        ],
      },
    },
  })
  @Get(':id')
  getFromFolder(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.getFromFolder(user.id, id);
  }
}
