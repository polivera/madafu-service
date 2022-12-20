import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
}
