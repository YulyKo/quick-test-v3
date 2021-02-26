import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsHexColor,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { config } from 'src/config';

@Exclude()
export class ResponseFolderDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  @MinLength(config.constants.question.name.min)
  @MaxLength(config.constants.question.name.max)
  name: string;

  @Expose()
  @IsHexColor()
  color: string;

  @Expose()
  @IsUUID()
  @Transform((value) => value.obj.parent.id, { toClassOnly: true })
  folder_id: string;
}
