import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { SourceType } from 'src/app.types';
import { DataSource, Repository } from 'typeorm';
import { MonthlyEntryRequestCreateDto } from '../monthly_entry/dto/monthly_entry.request.create.dto';
import { MonthlyEntry } from '../monthly_entry/monthly_entry.entity';
import { MonthlyEntryStatus } from '../monthly_entry/monthly_entry.types';
import { Source } from '../source/source.entity';
import { MonthlyExpense } from './monthly_expense.entity';
import { MonthlyExpenseStatus } from './monthly_expense.types';

@Injectable()
export class MonthlyExpenseService {
  @InjectRepository(MonthlyExpense)
  private readonly repository: Repository<MonthlyExpense>;

  private readonly AUTO_GENERATED_ENTRIES_COUNT = 12;

  constructor(private readonly dataSource: DataSource) {}

  async createMonthlyEntry(
    entry: MonthlyEntryRequestCreateDto,
    dbSource: Source,
    accountId: string,
  ): Promise<MonthlyExpense> {
    const monthlyExpense = new MonthlyExpense();
    monthlyExpense.sourceId = entry.sourceId;
    monthlyExpense.categoryId = entry.categoryId;
    monthlyExpense.accountId = accountId;
    monthlyExpense.description = entry.description;
    monthlyExpense.dateAdded = DateTime.utc().toJSDate();
    monthlyExpense.status = entry.isDraft
      ? MonthlyExpenseStatus.DRAFT
      : MonthlyExpenseStatus.NEW;

    if (entry.installments && dbSource.type === SourceType.CREDIT) {
      entry.amount =
        Math.round((entry.amount / entry.installments) * 100) / 100;
    }

    return this.dataSource.transaction(async (manager) => {
      const newExpense = await manager.save(monthlyExpense);
      const recordCount =
        entry.installments || this.AUTO_GENERATED_ENTRIES_COUNT / entry.lapse;
      const monthlyEntryList: MonthlyEntry[] = [];

      let todayDate = DateTime.utc().plus({ month: 1 }).startOf('month');
      for (let ind = 0; ind < recordCount; ind++) {
        const monthlyEntry = new MonthlyEntry();
        monthlyEntry.monthlyExpenseId = newExpense.id;
        monthlyEntry.amount = entry.amount;
        monthlyEntry.status =
          monthlyExpense.status === MonthlyExpenseStatus.DRAFT
            ? MonthlyEntryStatus.DRAFT
            : MonthlyEntryStatus.PENDING;
        monthlyEntry.paymentDate = todayDate.toISODate();
        todayDate = todayDate.plus({ month: entry.lapse });
        monthlyEntryList.push(monthlyEntry);
        console.log(todayDate.toISO());
      }
      await manager.save(monthlyEntryList);
      return monthlyExpense;
    });
  }
}
