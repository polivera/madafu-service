import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
})
export class SourceModule {}
