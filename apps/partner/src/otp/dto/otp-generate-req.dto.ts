import { IsMobilePhone } from 'class-validator';

export class OtpGenerateReqDto {
  @IsMobilePhone()
  phone: string;
}
