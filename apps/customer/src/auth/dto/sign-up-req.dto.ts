import { IsEmail, IsString } from 'class-validator';

export class SignUpReqDto {
  // @IsMobilePhone('en-US')
  phone: string;

  @IsString()
  secret: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;
}
