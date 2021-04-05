import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsHexColor,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { config } from '../../../config';

@Exclude()
export class ResponseFoldersDto {
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
  folderId: string;
}
