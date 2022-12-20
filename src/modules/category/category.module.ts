import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtAccessStrategy } from '../auth/strategies/jwt.access.strategy';
import { JwtAdminStrategy } from '../auth/strategies/jwt.admin.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, JwtAccessStrategy, JwtAdminStrategy],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
