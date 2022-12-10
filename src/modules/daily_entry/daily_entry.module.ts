import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEntry } from './daily_entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEntry])],
})
export class DailyEntryModule {}
