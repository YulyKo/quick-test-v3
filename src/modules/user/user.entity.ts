import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
