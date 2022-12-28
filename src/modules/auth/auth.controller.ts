import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Req() req: any) {
    return this.authService.logInUser(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: any,
    @Headers('authorization') authToken: string,
  ) {
    const tokenStr = authToken.split(' ')[1];
    const responseObject = await this.authService.refreshToken(
      req.user,
      tokenStr,
    );
    if (!responseObject) {
      throw new UnauthorizedException();
    }
    return responseObject;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/logout')
  @HttpCode(200)
  async logout(@Req() req: any, @Headers('authorization') authToken: string) {
    const tokenStr = authToken.split(' ')[1];
    if ((await this.authService.logout(req.user, tokenStr)) === 0) {
      throw new BadRequestException();
    }
    return;
  }
}
