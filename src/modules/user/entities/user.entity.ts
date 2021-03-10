import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Questions } from '../../question/entities/question.entity';
import { Folders } from '../../folders/entities/folders.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public email: string;

  @Column()
  public name: string;

  @Column()
  public hash: string;

  @Column({ nullable: true, default: null })
  public current_hashed_refresh_token_signature: string;

  @OneToMany(() => Questions, (question) => question.user, { cascade: true })
  questions: Questions[];

  @OneToMany(() => Questions, (folder) => folder.user, { cascade: true })
  folders: Folders[];
}
