import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

describe('OtpService', () => {
  let service: OtpService;
  let otpModelMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: getModelToken('Otp'),
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(60), // Assuming OTP_TTL is 60 seconds
          },
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    otpModelMock = module.get(getModelToken('Otp'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate OTP successfully', async () => {
      const phone = '1234567890';
      const mockOtp = {
        otpCode: '123456',
        phone,
        expirationTime: DateTime.now().plus({ second: 60 }).toJSON(),
        secret: 'mocked_secret',
      };
      otpModelMock.create.mockResolvedValue(mockOtp);

      await service.generate(phone);

      expect(otpModelMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ phone }),
      );
    });
  });

  describe('verify', () => {
    it('should verify OTP successfully', async () => {
      const phone = '1234567890';
      const otpCode = '123456';
      const mockOtp = {
        otpCode,
        phone,
        isVerified: false,
        expirationTime: DateTime.now().plus({ second: 60 }),
      };
      otpModelMock.findOneAndUpdate.mockResolvedValue(mockOtp);

      const result = await service.verify(phone, otpCode);

      expect(result).toEqual(mockOtp);
      expect(otpModelMock.findOneAndUpdate).toHaveBeenCalledWith(
        {
          phone,
          otpCode,
          isVerified: false,
          expirationTime: { $gt: expect.any(Date) }, // Match any Date object
        },
        { isVerified: true },
        { new: true },
      );
    });
  });

  describe('findByPhoneAndSecret', () => {
    it('should find OTP by phone and secret successfully', async () => {
      const phone = '1234567890';
      const secret = 'mocked_secret';
      const mockOtp = { phone, secret, isVerified: true };
      otpModelMock.findOne.mockResolvedValue(mockOtp);

      const result = await service.findSession(phone, secret);

      expect(result).toEqual(mockOtp);
      expect(otpModelMock.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ isVerified: true, secret: 'mocked_secret' }),
      );
    });
  });
});
