import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { ErrorCodes, ValidationErrorResponse } from 'src/utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { CategoryService } from '../category/category.service';
import { SourceService } from '../source/source.service';
import { DailyEntryService } from './daily_entry.service';
import { DailyEntryRequestCreateDto } from './dtos/daily_entry.request.create.dto';

@Controller('daily-entry')
export class DailyEntryController {
  constructor(
    private readonly entryService: DailyEntryService,
    private readonly sourceService: SourceService,
    private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post('/create')
  async createDailyEntry(
    @Body() entry: DailyEntryRequestCreateDto,
    @Req() req: any,
  ) {
    const dbSource = await this.sourceService.getSourceById(entry.sourceId);
    if (!dbSource) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.RELATION_NOT_FOUND}`)
        .badRequestResponse();
    }
    if (!dbSource.canUseToPay) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.SOURCE_CANT_PAY}`)
        .badRequestResponse();
    }
    if (dbSource.currency !== entry.currency) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.CURRENCY_MISMATCH}`)
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

    // @todo: use date library to set utc time if needed and validate date
    // it should not be from previous month and it should not be in the future
    if (!entry.date) {
      entry.date = DateTime.utc().toISO();
    } else {
      const paramDate = DateTime.fromISO(entry.date).toUTC();
      if (
        !paramDate.isValid ||
        paramDate >= DateTime.utc() ||
        paramDate <= DateTime.utc().startOf('month')
      ) {
        return ValidationErrorResponse.builder()
          .addErrorMessage(`date: ${ErrorCodes.INVALID_VALUE}`)
          .badRequestResponse();
      }
      entry.date = paramDate.toISO();
    }

    return this.entryService.createEntryAndUpdateSource(
      req.user.accountId,
      entry,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list/:year/:month')
  async listDailyEntries(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Req() req: any,
  ) {
    if (month < 1 || month > 12) {
      throw new NotFoundException();
    }
    const paramDate = DateTime.utc(year, month, 1);
    const entries = await this.entryService.getEntryList(
      paramDate.startOf('month').toJSDate(),
      paramDate.endOf('month').toJSDate(),
      req.user.accountId,
    );
    const total = entries.reduce((acc, curr) => curr.amount + acc, 0);
    return {
      entries,
      total,
    };
  }
}
