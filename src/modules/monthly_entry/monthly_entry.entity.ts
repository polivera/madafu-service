import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DailyEntry } from '../daily_entry/daily_entry.entity';
import { MonthlyExpense } from '../monthly_expense/monthly_expense.entity';
import { MonthlyEntryStatus } from './monthly_entry.types';

@Entity('monthly_entries')
export class MonthlyEntry {
  static readonly PAYMENT_DATE = 'paymentDate';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  monthlyExpenseId: string;

  @ManyToOne(() => MonthlyExpense, (monthlyExpense) => monthlyExpense.id, {
    nullable: false,
  })
  @JoinColumn()
  monthlyExpense: MonthlyExpense;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    nullable: false,
    transformer: {
      to(value: number): number {
        return value;
      },
      from(value: string): number {
        return parseFloat(value);
      },
    },
  })
  amount: number;

  @Index()
  @Column({ type: 'date' })
  paymentDate: string;

  @Column({
    type: 'enum',
    enum: MonthlyEntryStatus,
    default: MonthlyEntryStatus.PENDING,
  })
  status: MonthlyEntryStatus;

  @Column({ type: 'uuid', nullable: true })
  dailyEntryId: string;

  @ManyToOne(() => DailyEntry, (dailyEntry) => dailyEntry.id, {
    nullable: true,
  })
  @JoinColumn()
  dailyEntry: DailyEntry;
}
