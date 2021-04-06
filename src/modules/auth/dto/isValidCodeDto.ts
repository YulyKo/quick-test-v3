import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsCode } from '../../code/code.validator.decorator';

export class IsValidCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsCode()
  code: string;
}
