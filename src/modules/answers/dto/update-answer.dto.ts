import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  isTrue?: boolean;
}
