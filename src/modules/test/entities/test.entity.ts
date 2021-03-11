import { Folders } from '../../folders/entities/folders.entity';
import { Questions } from '../../question/entities/question.entity';
import { Users } from '../../user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { config } from '../../../config';

@Entity()
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  text: string;

  @Column({
    length: config.constants.test.code.length,
  })
  code: string;

  @Column({
    default: 'FALSE',
  })
  is_open: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted?: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne(() => Users, (user) => user.test)
  user: Users;

  @ManyToOne(() => Folders, (folder) => folder.test)
  folder: Folders;

  @ManyToMany(() => Questions)
  @JoinTable()
  questions: Questions[];
}
