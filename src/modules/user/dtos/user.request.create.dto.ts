import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPassword, ValidationErrors } from '../../../utils';

export class UserRequestCreateDto {
  @IsNotEmpty({ message: `email: ${ValidationErrors.NOT_EMPTY}` })
  @IsEmail({}, { message: `email: ${ValidationErrors.INVALID_EMAIL}` })
  email: string;

  @IsNotEmpty({ message: `password: ${ValidationErrors.NOT_EMPTY}` })
  @IsValidPassword({
    message: `password: ${ValidationErrors.REQUIREMENTS_NOT_MET}`,
  })
  password: string;
}
