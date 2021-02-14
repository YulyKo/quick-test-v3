import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  is_true: boolean;
}
