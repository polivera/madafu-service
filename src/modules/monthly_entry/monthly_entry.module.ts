import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyEntry } from './monthly_entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyEntry])],
})
export class MonthlyEntryModule {}
