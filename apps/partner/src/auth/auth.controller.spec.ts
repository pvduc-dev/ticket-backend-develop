import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/auth';
import { PartnerService } from '@app/partner';
import { SignInReqDto } from './dto/sign-in-req.dto';
import { SignUpReqDto } from './dto/sign-up-req.dto';
import { SignInResDto } from './dto/sign-in-res.dto';
import { SignUpResDto } from './dto/sign-up-res.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let partnerService: PartnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateCredential: jest.fn(),
            generateToken: jest.fn(),
          },
        },
        {
          provide: PartnerService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('3600'), // Example value for JWT_EXPIRES
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    partnerService = module.get<PartnerService>(PartnerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in successfully and return token', async () => {
      const signInDto: SignInReqDto = {
        phone: '123456789',
        secret: 'password',
      };
      const partner = { id: 'partner_id', isApproved: true };
      const accessToken = 'access_token';
      jest
        .spyOn(authService, 'validateCredential')
        .mockResolvedValueOnce(partner);
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(accessToken);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({
        accessToken,
        expiresIn: '3600',
        type: 'bearer',
      } as SignInResDto);
    });

    it('should throw BadRequestException if phone number has not registered account', async () => {
      const signInDto: SignInReqDto = {
        phone: '123456789',
        secret: 'password',
      };
      jest.spyOn(authService, 'validateCredential').mockResolvedValueOnce(null);

      await expect(controller.signIn(signInDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException if account is not approved', async () => {
      const signInDto: SignInReqDto = {
        phone: '123456789',
        secret: 'password',
      };
      const partner = { id: 'partner_id', isApproved: false };
      jest
        .spyOn(authService, 'validateCredential')
        .mockResolvedValueOnce(partner);

      await expect(controller.signIn(signInDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('signUp', () => {
    it('should sign up successfully and return token', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const signUpDto: SignUpReqDto = {
        phone: '123456789',
        email: 'test@example.com',
        fullName: 'Test User',
      };
      const customer = { id: 'customer_id' };
      const accessToken = 'access_token';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(partnerService, 'create').mockResolvedValueOnce(customer);
      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(accessToken);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual({
        accessToken,
        expiresIn: '3600',
        type: 'bearer',
      } as SignUpResDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 'user_id' };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(partnerService, 'findById').mockResolvedValueOnce(user);
      const req = { user };

      const result = await controller.getProfile(req);

      expect(result).toEqual(user);
    });
  });
});
