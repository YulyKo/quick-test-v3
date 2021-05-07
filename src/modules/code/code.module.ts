import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tests } from '../tests/entities/tests.entity';
import { Users } from '../users/entities/users.entity';

import { CodeService } from './code.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tests, Users])],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
