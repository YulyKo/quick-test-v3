import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  is_true?: boolean;
}
