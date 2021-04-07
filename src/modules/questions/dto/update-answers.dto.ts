import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswersDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  isTrue?: boolean;
}
