import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepositoryMock: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_secret'),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepositoryMock = module.get<UserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if found by id', async () => {
      const payload = { sub: 1 };
      const user = { id: 1, username: 'testuser' };
      (userRepositoryMock.findById as jest.Mock).mockResolvedValue(user);

      const doneCallback = jest.fn();
      await strategy.validate(payload, doneCallback);

      expect(doneCallback).toHaveBeenCalledWith(null, user);
    });

    it('should return null if user not found', async () => {
      const payload = { sub: 1 };
      (userRepositoryMock.findById as jest.Mock).mockResolvedValue(null);

      const doneCallback = jest.fn();
      await strategy.validate(payload, doneCallback);

      expect(doneCallback).toHaveBeenCalledWith(null, null);
    });

    it('should call done with error if error occurs', async () => {
      const payload = { sub: 1 };
      const error = new Error('Database error');
      (userRepositoryMock.findById as jest.Mock).mockRejectedValue(error);

      const doneCallback = jest.fn();
      await strategy.validate(payload, doneCallback);

      expect(doneCallback).toHaveBeenCalledWith(error);
    });
    it('should call done with error if an error occurs during validation', async () => {
      const payload = { sub: 1 };
      const error = new Error('Database error');
      (userRepositoryMock.findById as jest.Mock).mockRejectedValue(error);

      const doneCallback = jest.fn();
      await strategy.validate(payload, doneCallback);

      expect(doneCallback).toHaveBeenCalledWith(error);
    });
  });
});
