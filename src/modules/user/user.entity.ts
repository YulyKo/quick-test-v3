import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public email: string;

  @Column()
  public name: string;

  @Column()
  public hash: string;
}
