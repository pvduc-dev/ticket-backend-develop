import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInReqDto {
  @IsPhoneNumber()
  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone: string;

  @IsString()
  secret: string;
}
