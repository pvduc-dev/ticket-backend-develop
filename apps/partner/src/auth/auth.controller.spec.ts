import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/auth';
import { CustomerService } from '@app/customer';
import { ConfigService } from '@nestjs/config';
import { SignInReqDto } from './dto/sign-in-req.dto';
import { SignUpReqDto } from './dto/sign-up-req.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: AuthService;
  let customerServiceMock: CustomerService;
  // let configServiceMock: ConfigService;

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
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_expires'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get<AuthService>(AuthService);
    customerServiceMock = module.get<CustomerService>(CustomerService);
    // configServiceMock = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const signInDto: SignInReqDto = {
        phone: '1234567890',
        secret: 'password',
      };
      const mockCustomer = { id: 'mocked_customer_id' };
      const mockToken = 'mocked_token';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      authServiceMock.validateCredential.mockResolvedValue(mockCustomer);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      authServiceMock.generateToken.mockReturnValue(mockToken);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: 'mocked_expires',
        type: 'bearer',
      });
      expect(authServiceMock.validateCredential).toHaveBeenCalledWith(
        signInDto.phone,
        signInDto.secret,
      );
      expect(authServiceMock.generateToken).toHaveBeenCalledWith({
        sub: mockCustomer.id,
      });
    });

    it('should throw BadRequestException when credentials are invalid', async () => {
      const signInDto: SignInReqDto = {
        phone: '1234567890',
        secret: 'password',
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      authServiceMock.validateCredential.mockResolvedValue(null);

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const signUpDto: SignUpReqDto = {
        phone: '1234567890',
        email: 'test@example.com',
        fullName: 'Test User',
      };
      const mockCustomer = { id: 'mocked_customer_id' };
      const mockToken = 'mocked_token';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      customerServiceMock.create.mockResolvedValue(mockCustomer);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      authServiceMock.generateToken.mockReturnValue(mockToken);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: 'mocked_expires',
        type: 'bearer',
      });
      expect(customerServiceMock.create).toHaveBeenCalledWith({
        phone: signUpDto.phone,
        email: signUpDto.email,
        fullName: signUpDto.fullName,
      });
      expect(authServiceMock.generateToken).toHaveBeenCalledWith({
        sub: mockCustomer.id,
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 'mocked_user_id' };
      const mockCustomer = { id: 'mocked_customer_id', name: 'Mocked User' };
      const req = { user: mockUser };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      customerServiceMock.findById.mockResolvedValue(mockCustomer);

      const result = await controller.getProfile(req);

      expect(result).toEqual(mockCustomer);
      expect(customerServiceMock.findById).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
