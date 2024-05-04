import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  MaxLength,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class Business {
  @ApiProperty({ default: 'Google' })
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty({ nullable: true, default: '+84123456789' })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ nullable: true, default: 'https://google.com' })
  @IsUrl()
  @IsOptional()
  website?: string;
}
