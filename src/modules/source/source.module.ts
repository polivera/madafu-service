import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from '../auth/strategies/jwt.access.strategy';
import { Source } from './source.entity';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  providers: [JwtAccessStrategy, SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
