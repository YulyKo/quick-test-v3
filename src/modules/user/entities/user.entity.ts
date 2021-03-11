import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Questions } from '../../question/entities/question.entity';
import { Folders } from '../../folders/entities/folders.entity';
import { Test } from '../../test/entities/test.entity';

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
  public current_hashed_refresh_token_signature: string;

  @OneToMany(() => Questions, (question) => question.user, { cascade: true })
  questions: Questions[];

  @OneToMany(() => Folders, (folder) => folder.user, { cascade: true })
  folders: Folders[];

  @OneToMany(() => Test, (test) => test.user, { cascade: true })
  test: Test[];
}
