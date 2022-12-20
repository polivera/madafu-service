import { IsHexadecimal, IsNotEmpty } from 'class-validator';
import { ErrorCodes } from 'src/utils';

export class CategoryRequestCreateDto {
  @IsNotEmpty({ message: `name: ${ErrorCodes.NOT_EMPTY}` })
  name: string;

  @IsHexadecimal({ message: `color: ${ErrorCodes.INVALID_TYPE}` })
  color: string;
}
