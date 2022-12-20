import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Currency } from 'src/app.types';
import { ErrorCodes, IsValidDailyEntryDate } from 'src/utils';

export class DailyEntryRequestCreateDto {
  @IsNotEmpty({ message: `sourceId: ${ErrorCodes.NOT_EMPTY}` })
  @IsUUID('all', { message: `sourceId: ${ErrorCodes.INVALID_TYPE}` })
  sourceId: string;

  @IsNotEmpty({ message: `categoryId: ${ErrorCodes.NOT_EMPTY}` })
  @IsInt({ message: `categoryId: ${ErrorCodes.INVALID_TYPE}` })
  categoryId: number;

  @IsNotEmpty({ message: `description: ${ErrorCodes.NOT_EMPTY}` })
  description: string;

  @IsNotEmpty({ message: `amount: ${ErrorCodes.NOT_EMPTY}` })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `amount: ${ErrorCodes.INVALID_TYPE}` },
  )
  amount: number;

  @IsNotEmpty({ message: `currency: ${ErrorCodes.NOT_EMPTY}` })
  @IsEnum(Currency, { message: `currency: ${ErrorCodes.INVALID_VALUE}` })
  currency: Currency;

  @IsOptional()
  @IsDateString({}, { message: `date: ${ErrorCodes.INVALID_TYPE}` })
  @IsValidDailyEntryDate({ message: `date: ${ErrorCodes.INVALID_VALUE}` })
  date?: string;
}
