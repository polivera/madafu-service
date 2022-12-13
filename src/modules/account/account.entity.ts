import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DailyEntry } from '../daily_entry/daily_entry.entity';
import { MonthlyExpense } from '../monthly_expense/monthly_expense.entity';
import { Source } from '../source/source.entity';
import { User } from '../user/user.entity';
import { AccountStatus } from './account.types';

export const DEFAULT_ACCOUNT_NAME = 'Default';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'boolean' })
  isSelected: boolean;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ENABLE,
    nullable: false,
  })
  status: AccountStatus;

  // External entities that relate to his entity
  @OneToMany(() => Source, (source) => source.account)
  accounts: Source[];

  @OneToMany(() => DailyEntry, (dailyEntry) => dailyEntry.account)
  dailyEntries: DailyEntry[];

  @OneToMany(() => MonthlyExpense, (monthlyExpense) => monthlyExpense.account)
  monthlyExpenses: MonthlyExpense[];
}
