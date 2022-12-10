import { Currency } from 'src/app.types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';
import { Source } from '../source/source.entity';

@Entity('daily_entries')
export class DailyEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.id, { nullable: false })
  @JoinColumn()
  account: Promise<Account>;

  @ManyToOne(() => Source, (source) => source.id, { nullable: false })
  @JoinColumn()
  source: Promise<Source>;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn()
  category: Promise<Category>;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'money', nullable: false })
  amount: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.EUR,
  })
  currency: Currency;

  @Column({ type: 'timestamptz', precision: 3 })
  date: Date;
}
