import { Currency } from 'src/app.types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'money', default: 0, nullable: false })
  amount: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  canUseToPay: boolean;
}
