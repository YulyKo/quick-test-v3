import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Answers } from '../../answers/entities/answers.entity';
import { Users } from '../../user/entities/user.entity';
import { Folders } from '../../folders/entities/folders.entity';

export enum QuestionTemplate {
  BOOLEAN = 'boolean',
}

export enum QuestionAnswerType {
  BUTTON = 'button',
  userInput = 'userInput',
}

@Entity()
export class Questions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public name: string;

  @Column()
  public text: string;

  @Column()
  public time: number;

  @Column({
    type: 'enum',
    enum: QuestionTemplate,
  })
  public template: QuestionTemplate;

  @Column({
    type: 'enum',
    enum: QuestionAnswerType,
  })
  public answerType: QuestionAnswerType;

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

  @OneToMany(() => Answers, (answer) => answer.question)
  answers: Answers;

  @ManyToOne(() => Users, (user) => user.questions)
  user: Users;

  @ManyToOne(() => Folders, (folder) => folder.questions)
  folder: Folders;
}
