import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyExpense } from './monthly_expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyExpense])],
})
export class MonthlyExpenseModule {}
