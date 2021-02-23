import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';

@Exclude()
export class ResponseAnswersDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsBoolean()
  is_true: string;

  @Expose()
  @IsDate()
  created: Date;

  @Expose()
  @IsDate()
  updated: Date;
}
