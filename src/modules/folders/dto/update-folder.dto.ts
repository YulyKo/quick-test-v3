import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  color?: string;

  @ApiProperty()
  parent_id?: string;
}
