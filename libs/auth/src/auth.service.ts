import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '@app/otp';
import { UserRepository } from '@app/auth/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  /**
   * Generate a json web token from payload
   */
  public generateToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  public async validateCredential(phone: string, secret: string) {
    const otp = await this.otpService.findSession(phone, secret);
    if (!!otp) {
      return this.userRepository.findByPhone(otp.phone);
    }
    return null;
  }
}
