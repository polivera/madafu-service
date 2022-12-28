import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt.refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtService, JwtRefreshStrategy],
})
export class AuthModule {}
