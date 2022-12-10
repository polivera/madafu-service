import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';
import { MonthlyExpenseStatus } from './monthly_expense.types';

@Entity('monthly_expenses')
export class MonthlyExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.id, { nullable: false })
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn()
  category: Category;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'money', nullable: false })
  amount: number;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: 'NOW()',
  })
  dateAdded: Date;

  @Column({ type: 'timestamptz', nullable: true })
  dateEnd: Date | null;

  @Column()
  group: string;

  @Column({
    type: 'enum',
    enum: MonthlyExpenseStatus,
    default: MonthlyExpenseStatus.NEW,
  })
  status: MonthlyExpenseStatus;
}
