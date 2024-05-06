import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { Otp } from '@app/otp/schema/otp.schema';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;
  let otpModel: Model<Otp>;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: getModelToken(Otp.name),
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'TWILIO_PHONE_NUMBER':
                  return '+123456789';
                case 'OTP_TTL':
                  return 60;
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: TwilioService,
          useValue: {
            client: {
              messages: {
                create: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    otpModel = module.get<Model<Otp>>(getModelToken(Otp.name));
    twilioService = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate and send OTP code', async () => {
      const phone = '123456789';

      await service.generate(phone);

      expect(twilioService.client.messages.create).toHaveBeenCalledWith({
        from: expect.any(String),
        to: phone,
        body: expect.any(String),
      });
      expect(otpModel.create).toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    it('should verify OTP code', async () => {
      const phone = '123456789';
      const otpCode = '123456';

      await service.verify(phone, otpCode);

      expect(otpModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          phone,
          otpCode,
          isVerified: false,
          expirationTime: {
            $gt: expect.any(Date),
          },
        },
        {
          isVerified: true,
        },
        {
          new: true,
        },
      );
    });
  });

  describe('findSession', () => {
    it('should find OTP session by phone and secret', async () => {
      const phone = '123456789';
      const secret = 'secret';

      await service.findSession(phone, secret);

      expect(otpModel.findOne).toHaveBeenCalledWith({
        phone,
        secret,
        isVerified: true,
      });
    });
  });
});
