import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;
}