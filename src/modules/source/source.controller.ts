import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ErrorCodes, ValidationErrorResponse } from 'src/utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { DailyEntryService } from '../daily_entry/daily_entry.service';
import { SourceRequestCreateDto } from './dtos/source.request.create.dto';
import { SourceRequestUpdateDto } from './dtos/source.request.update.dto';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly dailyEntryService: DailyEntryService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post('/create')
  async createSource(
    @Body() createSourceDto: SourceRequestCreateDto,
    @Req() req: any,
  ) {
    const existingSource = await this.sourceService.getSourceByAccountAndName(
      req.user.accountId,
      createSourceDto.name,
    );
    if (existingSource) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`name: ${ErrorCodes.DUPLICATE_VALUE}`)
        .badRequestResponse();
    }
    return this.sourceService.saveSource(createSourceDto, req.user.accountId);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list')
  async getSources(@Req() req: any) {
    return this.sourceService.getSourcesForAccount(req.user.accountId);
  }

  @UseGuards(JwtAccessGuard)
  @Patch('/update/:id')
  async updateSource(
    @Param('id') id: string,
    @Body() sourceUpdate: SourceRequestUpdateDto,
    @Req() req: any,
  ) {
    const existingSource = await this.sourceService.getSourceById(id);
    if (!existingSource || existingSource.accountId !== req.user.accountId) {
      throw new NotFoundException();
    }

    const sourceEntries = await this.dailyEntryService.getEntriesBySourceId(id);
    if (
      sourceEntries.length > 0 &&
      (sourceUpdate.amount || sourceUpdate.currency || sourceUpdate.type)
    ) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(
          'Cannot change type, amount or currency for this source because is already in use',
        )
        .badRequestResponse();
    }

    const result = await this.sourceService.updateSource(sourceUpdate, id);
    if (result.affected !== 1) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(ErrorCodes.NO_UPDATE_ERROR)
        .internalServerError();
    }
    return;
  }

  @UseGuards(JwtAccessGuard)
  @Delete('/remote/:id')
  async removeAccount(@Param('id') id: string, @Req() req: any) {
    // TODO: implement remove account

    // remember to look for source id and user id before update
    // to make sure the source belong to the user
    // Only allow source deletion if the balance is 0
    console.log('implement delete account', id, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Put('/pay/:id')
  async convertEntryToDaily(@Param('id') id: string) {
    // TODO: Implement convert monthly to daily entry

    // Remember to look up for use id as well
    console.log('Implement this', id);
  }

  @UseGuards(JwtAccessGuard)
  @Put('pay-group/:group')
  async convertMonthlyGroupToDaily(@Param('group') group: string) {
    // TODO: Implement convert monthly group to daily entry

    // Remember to filter by user id as well
    console.log('Implement this', group);
  }
}
