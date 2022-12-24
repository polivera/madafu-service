import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SourceRequestCreateDto } from './dtos/source.request.create.dto';
import { Source } from './source.entity';

@Injectable()
export class SourceService {
  @InjectRepository(Source)
  private readonly repository: Repository<Source>;

  async saveSource(
    createSourceDto: SourceRequestCreateDto,
    accountId: string,
  ): Promise<Source> {
    const sourceModel = new Source();
    sourceModel.name = createSourceDto.name;
    sourceModel.amount = createSourceDto.amount;
    sourceModel.currency = createSourceDto.currency;
    sourceModel.type = createSourceDto.type;
    sourceModel.accountId = accountId;

    return this.repository.save(sourceModel);
  }

  async getSourcesForAccount(accountId: string): Promise<Source[]> {
    return this.repository.find({
      where: { accountId },
    });
  }

  async getSourceByAccountAndName(
    accountId: string,
    name: string,
  ): Promise<Source> {
    return this.repository.findOne({
      where: { name, accountId },
    });
  }

  async getSourceById(sourceId: string): Promise<Source> {
    return this.repository.findOneBy({ id: sourceId });
  }
}
