import { Folders } from '../../folders/entities/folders.entity';
import { Questions } from '../../questions/entities/questions.entity';
import { Users } from '../../users/entities/users.entity';
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
import question from 'test/mockData/question';

@Entity()
export class Tests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  text: string;

  @Column({
    length: config.constants.code.length,
  })
  code: string;

  @Column({
    default: 'FALSE',
  })
  isOpen: boolean;

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

  @ManyToOne(() => Users, (user) => user.tests)
  user: Users;

  @ManyToOne(() => Folders, (folder) => folder.tests)
  folder: Folders;

  @ManyToMany(() => Questions, (questions) => questions.tests)
  @JoinTable()
  questions: Questions[];
}
