import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { SourceType } from 'src/app.types';
import { ErrorCodes, ValidationErrorResponse } from 'src/utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { CategoryService } from '../category/category.service';
import { MonthlyExpenseService } from '../monthly_expense/monthly_expense.service';
import { SourceService } from '../source/source.service';
import { MonthlyEntryRequestCreateDto } from './dto/monthly_entry.request.create.dto';
import { MonthlyEntryService } from './monthly_entry.service';

@Controller('monthly-entry')
export class MonthlyEntryController {
  constructor(
    private readonly monthlyExpenseService: MonthlyExpenseService,
    private readonly monthlyEntryService: MonthlyEntryService,
    private readonly sourceService: SourceService,
    private readonly categoryService: CategoryService,
  ) {}
  @UseGuards(JwtAccessGuard)
  @Post('/create')
  async create(@Body() entry: MonthlyEntryRequestCreateDto, @Req() req: any) {
    const dbSource = await this.sourceService.getSourceById(entry.sourceId);
    if (!dbSource) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.RELATION_NOT_FOUND}`)
        .badRequestResponse();
    }
    if (
      ![SourceType.DEBIT, SourceType.CREDIT].find((st) => st === dbSource.type)
    ) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.INVALID_VALUE}`)
        .badRequestResponse();
    }

    // Retrieve category and check if exists
    const dbCategory = await this.categoryService.getCategoryById(
      entry.categoryId,
    );
    if (!dbCategory) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`cateoryId: ${ErrorCodes.RELATION_NOT_FOUND}`)
        .badRequestResponse();
    }
    const startOfMonthDate = DateTime.utc().plus({ month: 1 }).startOf('month');
    if (!entry.startDate) {
      entry.startDate = startOfMonthDate.toISO();
    } else {
      const paramDate = DateTime.fromISO(entry.startDate, { zone: 'UTC' });
      if (!paramDate.isValid || paramDate < startOfMonthDate) {
        return ValidationErrorResponse.builder()
          .addErrorMessage(`startDate: ${ErrorCodes.INVALID_VALUE}`)
          .badRequestResponse();
      }
    }
    entry.lapse = entry.lapse || 1;

    return this.monthlyExpenseService.createMonthlyEntry(
      entry,
      dbSource,
      req.user.accountId,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list/:year/:month')
  async listMonthlyEntries(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Req() req: any,
  ) {
    if (month < 1 || month > 12) {
      throw new NotFoundException();
    }
    const paramDate = DateTime.utc(year, month, 1);
    const entries = await this.monthlyEntryService.listEntries(
      paramDate.startOf('month').toJSDate(),
      paramDate.endOf('month').toJSDate(),
      req.user.accountId,
    );
    return entries;
  }
}
