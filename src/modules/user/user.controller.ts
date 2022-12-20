import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
    console.log(req.user);
  }
}
