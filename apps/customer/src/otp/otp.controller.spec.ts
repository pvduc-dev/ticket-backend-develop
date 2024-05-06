import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from '@app/otp';
import { OtpGenerateReqDto } from './dto/otp-generate-req.dto';
import { OtpVerifyReqDto } from './dto/otp-verify-req.dto';
import { OtpGenerateResDto } from './dto/otp-generate-res.dto';
import { OtpVerifyResDto } from './dto/otp-verify-res.dto';
import { CustomerService } from '@app/customer';

describe('OtpController', () => {
  let controller: OtpController;
  let otpService: OtpService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        {
          provide: OtpService,
          useValue: {
            generate: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('300'), // Example value for OTP_TTL
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findByPhone: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OtpController>(OtpController);
    otpService = module.get<OtpService>(OtpService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should generate OTP and return response', async () => {
      const phone = '123456789';
      const otpGenerateReqDto: OtpGenerateReqDto = { phone };
      const otpGenerateResDto: OtpGenerateResDto = {
        expiresIn: 300,
        expirationTime: new Date(),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(otpService, 'generate').mockResolvedValueOnce({
        expirationTime: otpGenerateResDto.expirationTime,
      });

      const result = await controller.generate(otpGenerateReqDto);

      expect(result).toEqual(otpGenerateResDto);
    });

    it('should throw BadRequestException if failed to generate OTP', async () => {
      const phone = '123456789';
      const otpGenerateReqDto: OtpGenerateReqDto = { phone };
      jest
        .spyOn(otpService, 'generate')
        .mockRejectedValueOnce(new Error('Failed to generate OTP'));

      await expect(controller.generate(otpGenerateReqDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('verify', () => {
    it('should verify OTP and return response if OTP is valid', async () => {
      const phone = '123456789';
      const otpCode = '123456';
      const otpVerifyReqDto: OtpVerifyReqDto = { phone, otpCode };
      const otpVerifyResDto: OtpVerifyResDto = {
        secret: 'secret',
        user: undefined,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(otpService, 'verify').mockResolvedValueOnce({
        phone,
        secret: otpVerifyResDto.secret,
      });
      jest.spyOn(customerService, 'findByPhone').mockResolvedValueOnce(null);

      const result = await controller.verify(otpVerifyReqDto);

      expect(result).toEqual(otpVerifyResDto);
    });

    it('should throw BadRequestException if OTP is invalid', async () => {
      const phone = '123456789';
      const otpCode = '123456';
      const otpVerifyReqDto: OtpVerifyReqDto = { phone, otpCode };
      jest.spyOn(otpService, 'verify').mockResolvedValueOnce(null);

      await expect(controller.verify(otpVerifyReqDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
