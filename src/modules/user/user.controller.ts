import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { UserRequestUpdateDto } from './dtos/user.request.update.dto';
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
    if (emailTaken) {
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

  @UseGuards(JwtAccessGuard)
  @Get('/self-update')
  async userSelfUpdate(@Req() req: any) {
    // TODO: Implement this
    console.log(req.user.userId);
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
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserRequestUpdateDto,
  ) {
    const dbUserById = await this.userService.getUserById(id);
    if (!dbUserById) {
      throw new NotFoundException();
    }

    if (updateUserDto.email) {
      const emailTaken = await this.userService.findUserByEmail(
        updateUserDto.email,
      );
      if (emailTaken && emailTaken.id !== id) {
        return ValidationErrorResponse.builder()
          .addErrorMessage(`email: ${ErrorCodes.DUPLICATE_VALUE}`)
          .badRequestResponse();
      }
    }

    // TODO: Review response logic and update response logic
    const result = await this.userService.updateUser(updateUserDto, id);
    if (result.affected !== 1) {
      // TODO: Create an error code when no records are updated
      return ValidationErrorResponse.builder()
        .addErrorMessage(`no record was update`)
        .internalServerError();
    }
    return;
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
