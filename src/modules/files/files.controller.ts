import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { FilesHttpService } from './files.http.service';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesHttpService: FilesHttpService) {}

  @ApiOperation({ summary: 'get all files from main page' })
  @Get()
  getFromMain(@GetUser() user) {
    return this.filesHttpService.getFromMain(user.id);
  }

  @ApiOperation({ summary: 'get all files from specific page' })
  @Get(':id')
  getFromFolder(@GetUser() user, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.filesHttpService.getFromFolder(user.id, id);
  }
}
