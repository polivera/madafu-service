import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { SourceType } from 'src/app.types';
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
    // FIX: Remove currency from daily entry
    if (dbSource.currency !== entry.currency) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`sourceId: ${ErrorCodes.CURRENCY_MISMATCH}`)
        .badRequestResponse();
    }
    if (
      ![SourceType.DEBIT, SourceType.CASH].find((st) => st === dbSource.type)
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

    if (!entry.date) {
      entry.date = DateTime.utc().toISO();
    } else {
      const paramDate = DateTime.fromISO(entry.date, { zone: 'UTC' });
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

  @UseGuards(JwtAccessGuard)
  @Get('/details/:id')
  async getEntryDetails(@Param('id') id: string) {
    // TODO: Do we really need get entry details now?

    // Remember to also filter by user id
    console.log('check if we need this endpoint', id);
  }

  @UseGuards(JwtAccessGuard)
  @Patch('/update/:id')
  async updateDailyEntry(@Param('id') id: string) {
    // TODO: Implement this endpoint

    // We should set a limit for how long can an entry be updated
    // Remember to filter by user id as well
    console.log('update daily entry', id);
  }

  @UseGuards(JwtAccessGuard)
  @Delete('/delete/:id')
  async deleteDailyEntry(@Param('id') id: string) {
    // TODO: Implement this

    // Same as update, stablish an allow delete limit
    // Remember to filter by user id
    console.log('delete daily entry', id);
  }
}
