import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}
