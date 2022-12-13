import {
  IsBoolean,
  IsCurrency,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Currency } from 'src/app.types';
import { ValidationErrors } from 'src/utils';

export class SourceRequestCreateDto {
  @IsNotEmpty({ message: `name: ${ValidationErrors.NOT_EMPTY}` })
  name: string;

  @IsEnum(Currency, { message: `currency: ${ValidationErrors.INVALID_VALUE}` })
  currency: Currency;

  @IsNotEmpty({ message: `amount: ${ValidationErrors.NOT_EMPTY}` })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `amount: ${ValidationErrors.INVALID_TYPE}` },
  )
  amount: number;

  @IsNotEmpty({ message: `canUseToPay: ${ValidationErrors.NOT_EMPTY}` })
  @IsBoolean({ message: `canUseToPay: ${ValidationErrors.INVALID_TYPE}` })
  canUseToPay: boolean;
}
