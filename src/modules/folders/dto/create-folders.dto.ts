import { ApiProperty } from '@nestjs/swagger';

export class CreateFoldersDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty({
    description: 'If create new folder in parent folder',
    required: false,
  })
  folderId?: string;
}
