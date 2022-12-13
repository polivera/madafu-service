import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRequestCreateDto } from './dtos/user.request.create.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { hashPassword } from '../../utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() userCreateDto: UserRequestCreateDto) {
    // Create user model
    const userModel = new User();
    userModel.email = userCreateDto.email;
    userModel.password = await hashPassword(userCreateDto.password);
    try {
      return await this.userService.createUser(userModel);
    } catch (err) {
      throw new HttpException(
        'Unexpected database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAccessGuard)
  @Get('/profile')
  async getCurrentUserProfile(@Req() req: any) {
    console.log(req.user);
  }
}
