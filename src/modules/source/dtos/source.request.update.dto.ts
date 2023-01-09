import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Currency, SourceType } from 'src/app.types';
import { ErrorCodes } from 'src/utils';

export class SourceRequestUpdateDto {
  @IsOptional()
  @IsString({ message: `name: ${ErrorCodes.INVALID_TYPE}` })
  name?: string;

  @IsOptional()
  @IsEnum(Currency, { message: `currency: ${ErrorCodes.INVALID_VALUE}` })
  currency?: Currency;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `amount: ${ErrorCodes.INVALID_TYPE}` },
  )
  amount?: number;

  @IsOptional()
  @IsEnum(SourceType, { message: `type: ${ErrorCodes.INVALID_VALUE}` })
  type?: SourceType;
}
