import { Module } from '@nestjs/common';

import { CodeService } from './code.service';
import { UserModule } from '../users/users.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
