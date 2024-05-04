import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { OtpService } from '@app/otp';
import { OtpGenerateReqDto } from './dto/otp-generate-req.dto';
import { OtpVerifyReqDto } from './dto/otp-verify-req.dto';
import { OtpGenerateResDto } from './dto/otp-generate-res.dto';
import { ConfigService } from '@nestjs/config';
import { OtpVerifyResDto } from './dto/otp-verify-res.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PartnerService } from '@app/partner';

@Controller('/otp')
@ApiTags('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
    private readonly partnerService: PartnerService,
  ) {}

  @Post('/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OtpGenerateResDto,
  })
  public async generate(
    @Body() otpGenerateReqDto: OtpGenerateReqDto,
  ): Promise<OtpGenerateResDto> {
    const otp = await this.otpService.generate(otpGenerateReqDto.phone);
    return {
      expiresIn: +this.configService.get<string>('OTP_TTL'),
      expirationTime: otp.expirationTime,
    };
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'OTP code is valid',
    type: OtpVerifyResDto,
  })
  @ApiBadRequestResponse({
    description: 'OTP code is invalid',
  })
  public async verify(
    @Body() otpVerifyReqDto: OtpVerifyReqDto,
  ): Promise<OtpVerifyResDto> {
    const otp = await this.otpService.verify(
      otpVerifyReqDto.phone,
      otpVerifyReqDto.otpCode,
    );
    if (!otp) {
      throw new BadRequestException('OTP code is invalid');
    }
    const partner =
      (await this.partnerService.findByPhone(otp.phone)) ?? undefined;
    return {
      secret: otp.secret,
      user: partner,
    };
  }
}
