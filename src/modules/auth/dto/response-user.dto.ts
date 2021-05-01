import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID, IsEmail } from 'class-validator';

@Exclude()
export class ResponseUserDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;
}
