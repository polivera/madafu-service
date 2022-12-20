import { Test, TestingModule } from '@nestjs/testing';
import { DailyEntryController } from './daily_entry.controller';

describe('DailyEntryController', () => {
  let controller: DailyEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyEntryController],
    }).compile();

    controller = module.get<DailyEntryController>(DailyEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
