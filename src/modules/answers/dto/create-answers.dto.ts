import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateAnswersDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsBoolean()
  @ApiProperty()
  isTrue: boolean;
}
