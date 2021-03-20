import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateFoldersDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
