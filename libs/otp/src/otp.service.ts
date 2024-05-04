import { Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '@app/otp/schema/otp.schema';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
  ) {}
  public async generate(phone: string) {
    const otpCode = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const secret = generate(64);
    await this.twilioService.client.messages.create({
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      to: phone,
      body: `Your OTP code is: ${otpCode}`,
    });
    const expirationTime = DateTime.now().plus({
      second: +this.configService.get<number>('OTP_TTL'),
    });
    return this.otpModel.create({
      otpCode,
      phone,
      expirationTime: expirationTime.toJSON(),
      secret,
    });
  }

  public async verify(phone: string, otpCode: string) {
    return this.otpModel.findOneAndUpdate(
      {
        phone,
        otpCode,
        isVerified: false,
        expirationTime: {
          $gt: new Date(),
        },
      },
      {
        isVerified: true,
      },
      {
        new: true,
      },
    );
  }

  public findSession(phone: string, secret: string) {
    return this.otpModel.findOne({
      secret,
      phone,
      isVerified: true,
    });
  }
}
