import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccountService } from '../account/account.service';
import { JwtAccessStrategy } from '../auth/strategies/jwt.access.strategy';
import { JwtAdminStrategy } from '../auth/strategies/jwt.admin.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  // TODO: Check if the Jwt strategy providers should be somewhere else, like in the app module.
  // Take note that daily_entry use it and there is no jwt provider
  providers: [UserService, AccountService, JwtAccessStrategy, JwtAdminStrategy],
  exports: [UserService],
})
export class UserModule {}
