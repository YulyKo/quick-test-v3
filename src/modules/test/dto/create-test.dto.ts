import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { config } from 'src/config';

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @MinLength(config.constants.test.name.min)
  @MaxLength(config.constants.test.name.max)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(config.constants.test.text.min)
  @MaxLength(config.constants.test.text.max)
  text: string;

  @IsString({ each: true })
  @ApiProperty({
    description: 'array of uuid questions id',
  })
  questions: string[];

  @ApiPropertyOptional()
  @IsUUID()
  folder_id?: string;
}
