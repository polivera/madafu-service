import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyExpense } from './monthly_expense.entity';
import { MonthlyExpenseService } from './monthly_expense.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyExpense])],
  providers: [MonthlyExpenseService],
  exports: [MonthlyExpenseService],
})
export class MonthlyExpenseModule {}
