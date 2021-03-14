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
import { Users } from '../../users/entities/users.entity';
import { Folders } from '../../folders/entities/folders.entity';

export enum QuestionsTemplate {
  BOOLEAN = 'boolean',
}

export enum QuestionsAnswerType {
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
    enum: QuestionsTemplate,
  })
  public template: QuestionsTemplate;

  @Column({
    type: 'enum',
    enum: QuestionsAnswerType,
  })
  public answerType: QuestionsAnswerType;

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
