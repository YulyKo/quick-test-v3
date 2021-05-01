import { Injectable } from '@nestjs/common';

import { config } from '../../config';
import { UsersService } from '../users/users.service';

@Injectable()
export class CodeService {
  constructor(private usersService: UsersService) {}

  generateCode() {
    let code = '';
    const { characters, length } = config.constants.code;
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async getUniqCode() {
    let code;
    let isUniq;
    do {
      code = this.generateCode();
      isUniq = await this.usersService.isUniqCode(code);
    } while (!isUniq);
    return code;
  }
}
