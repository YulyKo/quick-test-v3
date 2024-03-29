import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { config } from '../../../config';

export class UpdateTestsDto {
  @ApiProperty()
  @IsString()
  @MinLength(config.constants.test.name.min)
  @MaxLength(config.constants.test.name.max)
  name?: string;

  @ApiProperty()
  @IsString()
  @MinLength(config.constants.test.text.min)
  @MaxLength(config.constants.test.text.max)
  text?: string;

  @ApiPropertyOptional()
  @IsUUID()
  folderId?: string;
}
