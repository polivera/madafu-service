import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { UserRoles, UserStatus } from './user.types';

const TABLE_NAME = 'users';

@Entity(TABLE_NAME)
export class User {
  static readonly EMAIL_FIELD = 'email';
  static readonly STATUS_FIELD = 'status';
  static readonly ACCOUNTS_FIELD = 'accounts';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.CREATED,
    nullable: false,
  })
  status: UserStatus;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
