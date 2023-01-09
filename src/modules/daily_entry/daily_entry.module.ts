import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { SourceModule } from '../source/source.module';
import { DailyEntryController } from './daily_entry.controller';
import { DailyEntry } from './daily_entry.entity';
import { DailyEntryService } from './daily_entry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEntry]),
    forwardRef(() => SourceModule),
    CategoryModule,
  ],
  controllers: [DailyEntryController],
  providers: [DailyEntryService],
  exports: [DailyEntryService],
})
export class DailyEntryModule {}
