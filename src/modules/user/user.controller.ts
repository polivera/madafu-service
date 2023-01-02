import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ValidationErrorResponse, ErrorCodes } from '../../utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { JwtAdminGuard } from '../auth/guards/jwt.admin.guard';
import { UserRequestCreateDto } from './dtos/user.request.create.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAdminGuard)
  @Post('/create')
  async createUser(@Body() userCreateDto: UserRequestCreateDto) {
    const emailTaken = await this.userService.findUserByEmail(
      userCreateDto.email,
    );
    if (!emailTaken) {
      return ValidationErrorResponse.builder()
        .addErrorMessage(`email: ${ErrorCodes.DUPLICATE_VALUE}`)
        .badRequestResponse();
    }

    try {
      return await this.userService.createUser(userCreateDto);
    } catch (err) {
      return ValidationErrorResponse.builder()
        .addErrorMessage('Unexpected database error')
        .addErrorMessage(`stacktrace: ${err}`)
        .internalServerError();
    }
  }

  @UseGuards(JwtAccessGuard)
  @Get('/profile')
  async getCurrentUserProfile(@Req() req: any) {
    const dbUser = await this.userService.findUserByEmail(req.user.email);
    delete dbUser.password;
    return dbUser;
  }

  @UseGuards(JwtAdminGuard)
  @Get('/list')
  async getUserList() {
    // FIX: Pagination here maybe?
    return this.userService.listUsers();
  }

  @UseGuards(JwtAdminGuard)
  @Get('/detail/:id')
  async getUserDeatails(@Param('id') id: string) {
    return this.userService.getSingleUser(id);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('/update/:id')
  async updateUser(@Param('id') id: string) {
    // TODO: Implement user update
    console.log('implement this', id);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('/disable/:id')
  async disableUser(@Param('id') id: string) {
    // TODO: Implement user disable
    console.log('disable user', id);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('/make-admin/:id')
  async makeUserAdmin(@Param('id') id: string) {
    // TODO: Implement user make admin
    console.log('make user admin', id);
  }
}
