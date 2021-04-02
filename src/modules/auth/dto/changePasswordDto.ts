import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsPassword } from '../auth.password.validator.decorator';
import { IsCode } from '../auth.code.validator.decorator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPassword()
  password: string;

  @ApiProperty()
  @IsCode()
  code: string;
}
