import { HttpException, HttpStatus } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { config } from '../../config';

export function IsCode(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(code: any) {
          if (!code) {
            throw new HttpException('No code', HttpStatus.BAD_REQUEST);
          }
          if (code.match(config.constants.code.regexp)) return true;
          throw new HttpException('Bad code', HttpStatus.BAD_REQUEST);
        },
      },
    });
  };
}
