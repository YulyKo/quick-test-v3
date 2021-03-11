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
  isTrue: string;

  @Expose()
  @IsDate()
  created: Date;

  @Expose()
  @IsDate()
  updated: Date;
}
