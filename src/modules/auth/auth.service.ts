import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { checkPassword } from 'src/utils';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async isValidUser(email: string, password: string): Promise<boolean> {
    const dbUser = await this.userService.findVerifiedUserByEmail(email);
    return dbUser && (await checkPassword(password, dbUser.password));
  }

  async getAuthorizedUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const dbUser = await this.userService.findVerifiedUserByEmail(email);
    if (!dbUser || !(await checkPassword(password, dbUser.password))) {
      return null;
    }
    return dbUser;
  }

  async logInUser(user: User) {
    const tokenPayload = {
      userId: user.id,
      accountId: user.accounts.find((ac) => ac.isSelected)?.id || null,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get<string>('token.key'),
      expiresIn: this.configService.get<string>('token.accessExpiration'),
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get<string>('token.key'),
      expiresIn: this.configService.get<string>('token.refreshExpiration'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
