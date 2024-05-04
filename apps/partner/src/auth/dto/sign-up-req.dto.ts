import { IsEmail, IsMobilePhone, IsString } from 'class-validator';
import { Address, Business } from '@app/partner';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpReqDto {
  @IsMobilePhone()
  phone: string;

  @IsString()
  secret: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @ApiProperty({
    type: Address,
  })
  address: Address;

  @ApiProperty({
    type: Business,
  })
  business: Business;
}
