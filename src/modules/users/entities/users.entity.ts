import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Questions } from '../../questions/entities/questions.entity';
import { Folders } from '../../folders/entities/folders.entity';
import { Tests } from '../../tests/entities/tests.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  hash: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;

  @OneToMany(() => Questions, (question) => question.user, { cascade: true })
  questions: Questions[];

  @OneToMany(() => Folders, (folder) => folder.user, { cascade: true })
  folders: Folders[];

  @OneToMany(() => Tests, (test) => test.user, { cascade: true })
  tests: Tests[];
}
