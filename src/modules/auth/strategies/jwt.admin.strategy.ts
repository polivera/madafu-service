import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRoles } from 'src/modules/user/user.types';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('token.key'),
    });
  }

  async validate(payload: any) {
    if (payload.role !== UserRoles.ADMIN) {
      throw new UnauthorizedException("you don't have access to this resource");
    }
    return {
      userId: payload.userId,
      accountId: payload.accountId,
      email: payload.email,
      role: payload.role,
    };
  }
}
