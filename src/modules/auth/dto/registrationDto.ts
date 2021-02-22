import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { config } from '../../../config';
import { IsPassword } from '../auth.password.validator.decorator';

export class RegistrationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(config.constants.auth.name.min)
  @MaxLength(config.constants.auth.name.max)
  name: string;

  @ApiProperty()
  @IsPassword()
  password: string;
}
