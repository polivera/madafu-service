import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Currency, SourceType } from 'src/app.types';
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

  @IsNotEmpty({ message: `type: ${ErrorCodes.NOT_EMPTY}` })
  @IsEnum(SourceType, { message: `type: ${ErrorCodes.INVALID_VALUE}` })
  type: SourceType;
}
