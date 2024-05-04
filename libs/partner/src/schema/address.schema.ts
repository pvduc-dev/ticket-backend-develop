import { ApiProperty } from '@nestjs/swagger';
import { IsPostalCode, IsUppercase, Length, MaxLength } from 'class-validator';

export class Address {
  @ApiProperty()
  @MaxLength(40)
  stress: string;

  @ApiProperty({ default: 'Houston City' })
  @MaxLength(20)
  city: string;

  @ApiProperty({ default: 'AZ' })
  @IsUppercase()
  @Length(2, 2)
  state: string;

  @ApiProperty({ default: 100000, maxLength: 7 })
  @IsPostalCode()
  @MaxLength(5)
  zipCode: string;
}
