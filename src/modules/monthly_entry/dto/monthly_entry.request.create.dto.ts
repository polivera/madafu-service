import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ErrorCodes } from 'src/utils';

export class MonthlyEntryRequestCreateDto {
  @IsNotEmpty({ message: `sourceId: ${ErrorCodes.NOT_EMPTY}` })
  @IsUUID('all', { message: `sourceId: ${ErrorCodes.INVALID_TYPE}` })
  sourceId: string;

  @IsNotEmpty({ message: `categoryId: ${ErrorCodes.NOT_EMPTY}` })
  @IsInt({ message: `categoryId: ${ErrorCodes.INVALID_TYPE}` })
  categoryId: number;

  @IsNotEmpty({ message: `description: ${ErrorCodes.NOT_EMPTY}` })
  @IsString({ message: `description: ${ErrorCodes.INVALID_VALUE}` })
  description: string;

  // It will have the per-month amount if it is a
  // service like payment or the total amount if it
  // has installments. The app will divide the amount.
  @IsNotEmpty({ message: `amount: ${ErrorCodes.NOT_EMPTY}` })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `amount: ${ErrorCodes.INVALID_TYPE}` },
  )
  amount: number;

  // It will be positive int and default 0.
  @IsOptional()
  @IsInt({ message: `lapse: ${ErrorCodes.INVALID_TYPE}` })
  @Min(0, { message: `lapse: ${ErrorCodes.INVALID_VALUE}` })
  lapse?: number = 1;

  // It could be 0 in case is a service but the charge
  // is on the credit card. Otherwise will be positive int.
  @IsOptional()
  @IsInt({ message: `installments: ${ErrorCodes.INVALID_TYPE}` })
  @Min(0, { message: `installments: ${ErrorCodes.INVALID_VALUE}` })
  installments?: number = 0;

  @IsOptional()
  @IsDate({ message: `startDate: ${ErrorCodes.INVALID_VALUE}` })
  startDate?: string;

  @Optional()
  @IsBoolean({ message: `isDraft: ${ErrorCodes.INVALID_TYPE}` })
  isDraft?: boolean = false;
}
