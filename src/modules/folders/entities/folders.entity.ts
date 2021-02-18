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

import { Questions } from '../../question/entities/question.entity';
import { Users } from '../../user/entities/user.entity';

@Entity()
export class Folders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public name: string;

  @Column()
  public color: string;

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

  @OneToMany(() => Folders, (folder) => folder.parent)
  children: Folders[];

  @OneToMany(() => Questions, (question) => question.folder)
  questions: Questions[];

  @ManyToOne(() => Users, (user) => user.folders)
  user: Users;
}