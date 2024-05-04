import { IsMobilePhone, IsNumberString, Length } from 'class-validator';

export class OtpVerifyReqDto {
  @IsMobilePhone()
  phone: string;

  @IsNumberString()
  @Length(6, 6)
  otpCode: string;
}
