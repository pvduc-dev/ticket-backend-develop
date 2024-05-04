import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpModule as CoreOtpModule } from '@app/otp';
import { CustomerModule as CoreCustomerModule } from '@app/customer';

@Module({
  imports: [CoreOtpModule, CoreCustomerModule],
  controllers: [OtpController],
})
export class OtpModule {}
