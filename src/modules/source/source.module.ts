import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from '../auth/strategies/jwt.access.strategy';
import { DailyEntryModule } from '../daily_entry/daily_entry.module';
import { SourceController } from './source.controller';
import { Source } from './source.entity';
import { SourceService } from './source.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Source]),
    forwardRef(() => DailyEntryModule),
  ],
  // TODO: Check if JwtAccessStrategy provider is needed here
  providers: [JwtAccessStrategy, SourceService],
  controllers: [SourceController],
  exports: [SourceService],
})
export class SourceModule {}
