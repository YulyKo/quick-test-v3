import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Questions } from '../../question/entities/question.entity';

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

  @OneToMany(() => Questions, (question) => question.user)
  questions: Questions[];
}
