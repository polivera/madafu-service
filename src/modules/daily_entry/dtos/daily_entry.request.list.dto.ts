import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { ErrorCodes } from 'src/utils';

export class DailyEntryRequestListDto {
  @Type(() => Number)
  @IsNotEmpty({ message: 'que loco' })
  @IsInt({ message: `month: ${ErrorCodes.INVALID_TYPE}` })
  @Min(1, { message: `montha: ${ErrorCodes.INVALID_VALUE}` })
  @Max(12, { message: `monthb: ${ErrorCodes.INVALID_VALUE}` })
  month: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'que gato' })
  @IsInt({ message: `year: ${ErrorCodes.INVALID_VALUE}` })
  year: number;
}
