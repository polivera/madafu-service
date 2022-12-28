import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => User, (user) => user.id)
  user: User;

  @Column({ unique: true, nullable: false })
  token: string;

  @Column({ type: 'timestamptz' })
  createdAt: string;
}
