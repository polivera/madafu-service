import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPassword, ErrorCodes } from '../../../utils';

export class UserRequestCreateDto {
  @IsNotEmpty({ message: `email: ${ErrorCodes.NOT_EMPTY}` })
  @IsEmail({}, { message: `email: ${ErrorCodes.INVALID_EMAIL}` })
  email: string;

  @IsNotEmpty({ message: `password: ${ErrorCodes.NOT_EMPTY}` })
  @IsValidPassword({
    message: `password: ${ErrorCodes.REQUIREMENTS_NOT_MET}`,
  })
  password: string;
}
