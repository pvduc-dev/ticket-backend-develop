import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInReqDto } from './dto/sign-in-req.dto';
import { AuthService } from '@app/auth';
import { SignUpReqDto } from './dto/sign-up-req.dto';
import { CustomerService } from '@app/customer';
import { SignInResDto } from './dto/sign-in-res.dto';
import { JwtPayload } from '@app/auth';
import { ConfigService } from '@nestjs/config';
import { SignUpResDto } from './dto/sign-up-res.dto';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
  ) {}
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Sign in successfully',
    type: SignInResDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
  })
  public async signIn(@Body() signInDto: SignInReqDto): Promise<SignInResDto> {
    const customer = await this.authService.validateCredential(
      signInDto.phone,
      signInDto.secret,
    );
    if (!customer) {
      throw new BadRequestException('Invalid credentials');
    }
    const accessTokenPayload: JwtPayload = { sub: customer.id };
    const accessToken = this.authService.generateToken(accessTokenPayload);
    return {
      accessToken,
      expiresIn: this.configService.get('JWT_EXPIRES'),
      type: 'bearer',
    } as SignInResDto;
  }

  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SignUpResDto,
  })
  public async signUp(@Body() signUpDto: SignUpReqDto): Promise<SignUpResDto> {
    const customer = await this.customerService.create({
      phone: signUpDto.phone,
      email: signUpDto.email,
      fullName: signUpDto.fullName,
    });
    const accessTokenPayload: JwtPayload = {
      sub: customer.id,
    };
    const accessToken = this.authService.generateToken(accessTokenPayload);
    return {
      accessToken,
      expiresIn: this.configService.get('JWT_EXPIRES'),
      type: 'bearer',
    };
  }
}
