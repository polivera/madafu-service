import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth, startOfMonth } from 'date-fns';
import { DateTime } from 'luxon';
import { Between, DataSource, Repository } from 'typeorm';
import { Source } from '../source/source.entity';
import { DailyEntry } from './daily_entry.entity';
import { DailyEntryRequestCreateDto } from './dtos/daily_entry.request.create.dto';

@Injectable()
export class DailyEntryService {
  @InjectRepository(DailyEntry)
  private readonly repository: Repository<DailyEntry>;

  constructor(private readonly dataSource: DataSource) {}

  async listEntries(entryDate: Date, accountId: string): Promise<DailyEntry[]> {
    return this.repository.find({
      where: {
        date: Between(startOfMonth(entryDate), endOfMonth(entryDate)),
        accountId,
      },
    });
  }

  async getEntryList(
    start: Date,
    end: Date,
    accountId: string,
  ): Promise<DailyEntry[]> {
    return this.repository
      .createQueryBuilder('e')
      .innerJoinAndSelect(`e.source`, 'sc')
      .innerJoinAndSelect(`e.category`, 'cf')
      .where(`e.${DailyEntry.ACCOUNT_FIELD} = :accountId`, { accountId })
      .andWhere(`e.${DailyEntry.DATE_FIELD} BETWEEN :start AND :end `, {
        start,
        end,
      })
      .getMany();
  }

  async createEntryAndUpdateSource(
    accountId: string,
    entry: DailyEntryRequestCreateDto,
  ): Promise<DailyEntry> {
    const entryModel = new DailyEntry();
    entryModel.accountId = accountId;
    entryModel.sourceId = entry.sourceId;
    entryModel.categoryId = entry.categoryId;
    entryModel.description = entry.description;
    entryModel.amount = entry.amount;
    entryModel.currency = entry.currency;
    entryModel.date = DateTime.fromISO(entry.date).toJSDate();

    return this.dataSource.transaction(async (manager) => {
      const newEntry = await manager.save(entryModel);
      await manager
        .createQueryBuilder()
        .update(Source)
        .set({ amount: () => `amount + ${newEntry.amount}` })
        .where('id = :id', { id: newEntry.sourceId })
        .execute();

      return newEntry;
    });
  }
}
