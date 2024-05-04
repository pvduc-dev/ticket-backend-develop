import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { OtpService } from '@app/otp';
import { ConfigService } from '@nestjs/config';
import { OtpGenerateReqDto } from './dto/otp-generate-req.dto';
import { OtpVerifyReqDto } from './dto/otp-verify-req.dto';
import { BadRequestException } from '@nestjs/common';

describe('OtpController', () => {
  let controller: OtpController;
  let otpServiceMock: OtpService;

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
            get: jest.fn().mockReturnValue('mocked_ttl'),
          },
        },
      ],
    }).compile();

    controller = module.get<OtpController>(OtpController);
    otpServiceMock = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should generate OTP successfully', async () => {
      const otpGenerateReqDto: OtpGenerateReqDto = { phone: '1234567890' };
      await controller.generate(otpGenerateReqDto);

      expect(otpServiceMock.generate).toHaveBeenCalledWith(
        otpGenerateReqDto.phone,
      );
    });
  });

  describe('verify', () => {
    it('should verify OTP successfully', async () => {
      const otpVerifyReqDto: OtpVerifyReqDto = {
        phone: '1234567890',
        otpCode: '123456',
      };
      const mockOtp = { secret: 'mocked_secret' };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      otpServiceMock.verify.mockResolvedValue(mockOtp);

      const result = await controller.verify(otpVerifyReqDto);

      expect(result).toEqual({ secret: 'mocked_secret' });
      expect(otpServiceMock.verify).toHaveBeenCalledWith(
        otpVerifyReqDto.phone,
        otpVerifyReqDto.otpCode,
      );
    });

    it('should throw BadRequestException when OTP is invalid', async () => {
      const otpVerifyReqDto: OtpVerifyReqDto = {
        phone: '1234567890',
        otpCode: '123456',
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      otpServiceMock.verify.mockResolvedValue(null);

      await expect(controller.verify(otpVerifyReqDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
