import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Questions } from '../../question/entities/question.entity';

@Entity()
export class Answers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public name: string;

  @Column()
  public is_true: boolean;

  @ManyToOne(() => Questions, (question) => question.answers)
  questions: Questions;
}
