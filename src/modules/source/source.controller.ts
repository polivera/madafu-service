import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ValidationErrorResponse, ErrorCodes } from 'src/utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { SourceRequestCreateDto } from './dtos/source.request.create.dto';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

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
  async updateSource(@Param('id') id: string, @Req() req: any) {
    // TODO: Implement source update

    // remember to look for source id and user id before update
    // to make sure the source belong to the user
    // If the source has been use for some expense, you can only edit name
    console.log('implement source update', id, req.user.userId);
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
}
