import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty({
    description: 'If create new folder in parent folder',
    required: false,
  })
  folder_id?: string;
}
