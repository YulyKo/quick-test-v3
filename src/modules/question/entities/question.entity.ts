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

export enum QuestionTemplate {
  BOOLEAN = 'boolean',
}

export enum QuestionAnswerType {
  BUTTON = 'button',
  USER_INPUT = 'user_input',
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
  public answer_type: QuestionAnswerType;

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

  @OneToMany(() => Answers, (answer) => answer.questions)
  answers: Answers[];

  @ManyToOne(() => Users, (user) => user.questions)
  user: Users;
}
