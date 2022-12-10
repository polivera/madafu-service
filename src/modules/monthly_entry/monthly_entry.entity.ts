import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DailyEntry } from '../daily_entry/daily_entry.entity';
import { MonthlyExpense } from '../monthly_expense/monthly_expense.entity';
import { MonthlyEntryStatus } from './monthly_entry.types';

@Entity('monthly_entries')
export class MonthlyEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MonthlyExpense, (monthlyExpense) => monthlyExpense.id, {
    nullable: false,
  })
  @JoinColumn()
  monthlyExpense: Promise<MonthlyExpense>;

  @Column({ type: 'money', nullable: false })
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: MonthlyEntryStatus,
    default: MonthlyEntryStatus.PENDING,
  })
  status: MonthlyEntryStatus;

  @ManyToOne(() => DailyEntry, (dailyEntry) => dailyEntry.id, {
    nullable: true,
  })
  @JoinColumn()
  dailyEntry: string;

  @Column()
  entryCount: number;
}
