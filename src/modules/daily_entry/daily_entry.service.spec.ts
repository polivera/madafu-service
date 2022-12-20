import { Test, TestingModule } from '@nestjs/testing';
import { DailyEntryService } from './daily_entry.service';

describe('DailyEntryService', () => {
  let service: DailyEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEntryService],
    }).compile();

    service = module.get<DailyEntryService>(DailyEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
