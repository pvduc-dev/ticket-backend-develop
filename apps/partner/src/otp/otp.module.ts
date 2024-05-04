import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpModule as CoreOtpModule } from '@app/otp';
import { PartnerModule as CorePartnerModule } from '@app/partner';

@Module({
  imports: [CoreOtpModule, CorePartnerModule],
  controllers: [OtpController],
})
export class OtpModule {}
