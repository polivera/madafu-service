import { Currency } from 'src/app.types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.id, { nullable: false })
  account: Account;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
    nullable: false,
  })
  currency: Currency;

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

  @Column({ type: 'boolean', default: true, nullable: false })
  canUseToPay: boolean;
}
