import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { SourceRequestCreateDto } from './dtos/source.request.create.dto';
import { Source } from './source.entity';
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
    const sourceModel = new Source();
    sourceModel.name = createSourceDto.name;
    sourceModel.amount = createSourceDto.amount;
    sourceModel.currency = createSourceDto.currency;
    sourceModel.canUseToPay = createSourceDto.canUseToPay;
    sourceModel.account = req.user.accountId;
    return this.sourceService.saveSource(sourceModel);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list')
  async getSources(@Req() req: any) {
    return this.sourceService.getSourcesForAccount(req.user.accountId);
  }
}
