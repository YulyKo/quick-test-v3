import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFoldersDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsHexColor()
  color: string;

  @ApiProperty({
    description: 'If create new folder in parent folder',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  folderId?: string;
}
