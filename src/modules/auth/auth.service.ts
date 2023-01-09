import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { checkPassword } from 'src/utils';
import { TokenService } from '../token/token.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

type UserToken = {
  userId: string;
  accountId: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
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

    await this.tokenService.saveToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userToken: UserToken, token: string) {
    const dbToken = await this.tokenService.getToken(token);
    if (!dbToken || dbToken.userId !== userToken.userId) {
      return null;
    }
    return {
      accessToken: await this.generateAccessToken(userToken),
    };
  }

  async logout(tokenData: UserToken, token: string) {
    const result = await this.tokenService.removeToken(token, tokenData.userId);
    return result.affected || 0;
  }

  private async generateAccessToken(tokenPayload: UserToken): Promise<string> {
    return this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get<string>('token.key'),
      expiresIn: this.configService.get<string>('token.accessExpiration'),
    });
  }
}
