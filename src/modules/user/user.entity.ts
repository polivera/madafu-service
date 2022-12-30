import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Token } from '../token/token.entity';
import { UserRoles, UserStatus } from './user.types';

const TABLE_NAME = 'users';

@Entity(TABLE_NAME)
export class User {
  static readonly ID_FIELD = 'id';
  static readonly EMAIL_FIELD = 'email';
  static readonly STATUS_FIELD = 'status';
  static readonly ROLE_FIELD = 'role';
  // Join attribute name
  static readonly ACCOUNTS_FIELD = 'accounts';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
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

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
