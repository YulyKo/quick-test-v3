import { ApiProperty } from '@nestjs/swagger';

export class UpdateFoldersDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  color?: string;

  @ApiProperty()
  parentId?: string;
}
