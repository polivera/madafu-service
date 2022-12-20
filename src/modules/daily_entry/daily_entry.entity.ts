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
  static readonly ACCOUNT_FIELD = 'accountId';
  static readonly SOURCE_FIELD = 'sourceId';
  static readonly CATEGORY_FIELD = 'categoryId';
  static readonly DESCRIPTION_FIELD = 'description';
  static readonly AMOUNT_FIELD = 'amount';
  static readonly CURRENCY_FIELD = 'currency';
  static readonly DATE_FIELD = 'date';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.id, { nullable: false })
  @JoinColumn()
  account: Account;

  @Column({ type: 'uuid', nullable: false })
  sourceId: string;

  @ManyToOne(() => Source, (source) => source.id, { nullable: false })
  @JoinColumn()
  source: Source;

  @Column({ nullable: false })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn()
  category: Category;

  @Column({ nullable: false })
  description: string;

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

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.EUR,
  })
  currency: Currency;

  @Column({ type: 'timestamptz', precision: 3 })
  date: Date;
}
