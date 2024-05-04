import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateSlotDto {
  @IsDateString()
  startDate: Date;

  @IsString()
  gateway: string;

  @IsString()
  section: string;

  @IsString()
  seat: string;

  @IsNumber()
  price: number;
}
