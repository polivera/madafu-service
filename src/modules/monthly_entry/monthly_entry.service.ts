import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MonthlyExpense } from '../monthly_expense/monthly_expense.entity';
import { MonthlyEntry } from './monthly_entry.entity';

@Injectable()
export class MonthlyEntryService {
  @InjectRepository(MonthlyEntry)
  private readonly repository: Repository<MonthlyEntry>;

  async listEntries(
    start: Date,
    end: Date,
    accountId: string,
  ): Promise<MonthlyEntry[]> {
    return this.repository
      .createQueryBuilder('e')
      .innerJoinAndSelect('e.monthlyExpense', 'me')
      .innerJoinAndSelect('me.source', 'sc')
      .innerJoinAndSelect('me.category', 'cf')
      .where(`me.${MonthlyExpense.ACCOUNT_ID} = :accountId`, { accountId })
      .andWhere(`e.${MonthlyEntry.PAYMENT_DATE} BETWEEN :start AND :end`, {
        start,
        end,
      })
      .getMany();
  }
}
