import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Source } from './source.entity';

@Injectable()
export class SourceService {
  @InjectRepository(Source)
  private readonly repository: Repository<Source>;

  async saveSource(source: Source): Promise<Source> {
    return this.repository.save(source);
  }

  async getSourcesForAccount(accountId: string): Promise<Source[]> {
    return await this.repository.find({
      where: { accountId },
    });
  }
}
