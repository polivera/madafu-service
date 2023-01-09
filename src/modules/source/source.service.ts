import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SourceRequestCreateDto } from './dtos/source.request.create.dto';
import { SourceRequestUpdateDto } from './dtos/source.request.update.dto';
import { Source } from './source.entity';

@Injectable()
export class SourceService {
  @InjectRepository(Source)
  private readonly repository: Repository<Source>;

  constructor(private readonly dataSource: DataSource) {}

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

  async getSourceById(id: string): Promise<Source> {
    return this.repository.findOne({ where: { id } });
  }

  async updateSource(sourceData: SourceRequestUpdateDto, id: string) {
    return this.dataSource
      .createQueryBuilder()
      .update(Source)
      .set(sourceData)
      .where(`${Source.ID_FIELD} = :id`, { id })
      .execute();
  }
}
