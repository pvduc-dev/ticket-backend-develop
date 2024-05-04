import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '@app/otp/schema/otp.schema';
import { ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Otp.name,
        useFactory: () => {
          const schema = OtpSchema;
          return schema;
        },
      },
    ]),
    TwilioModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get<string>('TWILIO_ACCOUNT_SID'),
        authToken: configService.get<string>('TWILIO_AUTH_TOKEN'),
      }),
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
