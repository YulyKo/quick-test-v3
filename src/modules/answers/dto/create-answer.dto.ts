import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  isTrue: boolean;
}
