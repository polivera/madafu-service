import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MonthlyExpenseModule } from '../monthly_expense/monthly_expense.module';
import { SourceModule } from '../source/source.module';
import { MonthlyEntryController } from './monthly_entry.controller';
import { MonthlyEntry } from './monthly_entry.entity';
import { MonthlyEntryService } from './monthly_entry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthlyEntry]),
    SourceModule,
    CategoryModule,
    MonthlyExpenseModule,
  ],
  controllers: [MonthlyEntryController],
  providers: [MonthlyEntryService],
})
export class MonthlyEntryModule {}
