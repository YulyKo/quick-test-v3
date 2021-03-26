import { HttpException, HttpStatus } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { config } from '../../config';

export function IsPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(password: string) {
          if (!password) {
            throw new HttpException('No password', HttpStatus.BAD_REQUEST);
          }
          if (password.match(config.constants.auth.password)) return true;
          throw new HttpException('Bad password', HttpStatus.BAD_REQUEST);
        },
      },
    });
  };
}
