import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '@app/otp';
import { UserRepository } from '@app/auth/user.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let otpService: OtpService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: OtpService,
          useValue: {
            findSession: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findByPhone: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    otpService = module.get<OtpService>(OtpService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should call jwtService.sign with correct payload', () => {
      const payload = { id: 1, username: 'testuser' };
      const expectedToken = 'mockedToken';
      (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

      const token = service.generateToken(payload);

      expect(token).toEqual(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('validateCredential', () => {
    it('should return user if OTP session found', async () => {
      const phone = '123456789';
      const secret = '123456';
      const otpSession = { phone };
      const user = { id: 1, username: 'testuser' };
      (otpService.findSession as jest.Mock).mockResolvedValue(otpSession);
      (userRepository.findByPhone as jest.Mock).mockResolvedValue(user);

      const result = await service.validateCredential(phone, secret);

      expect(result).toEqual(user);
      expect(otpService.findSession).toHaveBeenCalledWith(phone, secret);
      expect(userRepository.findByPhone).toHaveBeenCalledWith(phone);
    });

    it('should return null if OTP session not found', async () => {
      const phone = '123456789';
      const secret = '123456';
      (otpService.findSession as jest.Mock).mockResolvedValue(null);

      const result = await service.validateCredential(phone, secret);

      expect(result).toBeNull();
      expect(otpService.findSession).toHaveBeenCalledWith(phone, secret);
      expect(userRepository.findByPhone).not.toHaveBeenCalled();
    });
  });
});
