import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DailyEntry } from '../daily_entry/daily_entry.entity';
import { MonthlyExpense } from '../monthly_expense/monthly_expense.entity';
import { CategoryStatus } from './category.types';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @Column({ unique: true })
  color: string;

  // External table reference to this entity
  @OneToMany(() => DailyEntry, (dailyEntry) => dailyEntry.category)
  dailyEntries: Promise<DailyEntry[]>;

  @OneToMany(() => MonthlyExpense, (monthlyExpense) => monthlyExpense.category)
  monthlyExpenses: Promise<MonthlyExpense[]>;
}
