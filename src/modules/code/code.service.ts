import { Injectable } from '@nestjs/common';

import { config } from '../../config';

@Injectable()
export class CodeService {
  generateCode() {
    let code = '';

    const { characters, length } = config.constants.code;

    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }
}
