import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswersDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  isTrue: boolean;
}
