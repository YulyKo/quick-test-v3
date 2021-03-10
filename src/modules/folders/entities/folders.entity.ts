import {
  Column,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { Questions } from '../../questions/entities/questions.entity';
import { Users } from '../../user/entities/user.entity';
import { Test } from '../../test/entities/test.entity';

@Entity()
export class Folders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

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

  @ManyToOne(() => Folders, (folder) => folder.children)
  parent: Folders;

  @OneToMany(() => Folders, (folder) => folder.parent, {
    cascade: true,
  })
  children: Folders[];

  @OneToMany(() => Questions, (question) => question.folders, {
    cascade: true,
  })
  questions: Questions[];

  @ManyToOne(() => Users, (user) => user.folders)
  user: Users;

  @OneToMany(() => Test, (test) => test.folder, { cascade: true })
  test: Test[];
}
