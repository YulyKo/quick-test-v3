import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { IsUUID, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

class eachIsUUID {
  @IsUUID(4, { each: true })
  folderId: string;
}

@Injectable()
export class UuidCommaSeparatedPipe implements PipeTransform<string> {
  async transform(value: any) {
    const values = value.split(',');
    const object = plainToClass(eachIsUUID, values);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('id should be UUID v4');
    }
    return values;
  }
}
