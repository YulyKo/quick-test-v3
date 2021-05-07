import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { config } from '../../config';
import { Tests } from '../tests/entities/tests.entity';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class CodeService {
  private generateCode() {
    let code = '';

    const { characters, length } = config.constants.code;

    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }

  private async isUniqCode(
    repository: Repository<Users | Tests>,
    code: string,
  ) {
    const codeFromDB = await repository.findOne({ code });
    return !codeFromDB;
  }

  async getUniqCode(repository: Repository<Users | Tests>): Promise<string> {
    let code;
    let isUniq;
    do {
      code = this.generateCode();
      isUniq = await this.isUniqCode(repository, code);
    } while (!isUniq);
    return code;
  }
}
