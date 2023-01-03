import { IsEmail, IsOptional } from 'class-validator';
import { ErrorCodes, IsValidPassword } from '../../../utils';

export class UserRequestUpdateDto {
  @IsOptional()
  @IsEmail({}, { message: `email: ${ErrorCodes.INVALID_EMAIL}` })
  email?: string;

  @IsOptional()
  @IsValidPassword({
    message: `password: ${ErrorCodes.REQUIREMENTS_NOT_MET}`,
  })
  password?: string;
}
