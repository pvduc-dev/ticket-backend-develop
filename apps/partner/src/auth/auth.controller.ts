import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInReqDto } from './dto/sign-in-req.dto';
import { AuthService } from '@app/auth';
import { SignUpReqDto } from './dto/sign-up-req.dto';
import { Auth } from '@app/auth';
import { SignInResDto } from './dto/sign-in-res.dto';
import { JwtPayload } from '@app/auth';
import { ConfigService } from '@nestjs/config';
import { Customer } from '@app/customer/schema/customer.schema';
import { SignUpResDto } from './dto/sign-up-res.dto';
import { PartnerService } from '@app/partner';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly partnerService: PartnerService,
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
    const partner = await this.authService.validateCredential(
      signInDto.phone,
      signInDto.secret,
    );
    if (!partner) {
      throw new BadRequestException('Phone number has not registered account');
    }
    if (!partner.isApproved) {
      throw new ForbiddenException('Your account is currently pending review');
    }
    const accessTokenPayload: JwtPayload = { sub: partner.id };
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
    const customer = await this.partnerService.create({
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

  @Get('/me')
  @Auth()
  @ApiOkResponse({
    type: Customer,
  })
  public getProfile(@Req() req: any) {
    return this.partnerService.findById(req.user.id);
  }
}
