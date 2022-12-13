import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccountService } from '../account/account.service';
import { JwtAccessStrategy } from '../auth/strategies/jwt.access.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AccountService, JwtAccessStrategy],
  exports: [UserService],
})
export class UserModule {}
