import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { FilesHttpService } from './files.http.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesHttpService: FilesHttpService) {}

  @ApiOperation({ summary: 'get all files from main page' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        created: 'timestamptz',
        message: 'question successfully created',
      },
    },
  })
  @Get()
  create(@GetUser() user) {
    return this.filesHttpService.getFromMain(user.id);
  }
}
