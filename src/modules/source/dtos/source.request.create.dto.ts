import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Currency } from 'src/app.types';
import { ErrorCodes } from 'src/utils';

export class SourceRequestCreateDto {
  @IsNotEmpty({ message: `name: ${ErrorCodes.NOT_EMPTY}` })
  name: string;

  @IsEnum(Currency, { message: `currency: ${ErrorCodes.INVALID_VALUE}` })
  currency: Currency;

  @IsNotEmpty({ message: `amount: ${ErrorCodes.NOT_EMPTY}` })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `amount: ${ErrorCodes.INVALID_TYPE}` },
  )
  amount: number;

  @IsNotEmpty({ message: `canUseToPay: ${ErrorCodes.NOT_EMPTY}` })
  @IsBoolean({ message: `canUseToPay: ${ErrorCodes.INVALID_TYPE}` })
  canUseToPay: boolean;
}
