import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { SourceModule } from '../source/source.module';
import { DailyEntryController } from './daily_entry.controller';
import { DailyEntry } from './daily_entry.entity';
import { DailyEntryService } from './daily_entry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEntry]),
    SourceModule,
    CategoryModule,
  ],
  controllers: [DailyEntryController],
  providers: [DailyEntryService],
})
export class DailyEntryModule {}
