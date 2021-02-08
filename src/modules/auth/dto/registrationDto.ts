import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}
