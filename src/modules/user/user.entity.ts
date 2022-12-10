import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { UserStatus } from './user.types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.CREATED,
    nullable: false,
  })
  status: UserStatus;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Promise<Account[]>;
}
