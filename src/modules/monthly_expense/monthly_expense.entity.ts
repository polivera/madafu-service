import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';
import { Source } from '../source/source.entity';
import { MonthlyExpenseStatus } from './monthly_expense.types';

@Entity('monthly_expenses')
export class MonthlyExpense {
  static readonly ACCOUNT_ID = 'accountId';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.id, { nullable: false })
  @JoinColumn()
  account: Account;

  @Column({ type: 'uuid' })
  sourceId: string;

  @ManyToOne(() => Source, (source) => source.id, { nullable: false })
  @JoinColumn()
  source: Source;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn()
  category: Category;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: 'NOW()',
  })
  dateAdded: Date;

  @Column({
    type: 'enum',
    enum: MonthlyExpenseStatus,
    default: MonthlyExpenseStatus.NEW,
  })
  status: MonthlyExpenseStatus;
}
