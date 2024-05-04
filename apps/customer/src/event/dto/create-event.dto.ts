import { CreateSlotDto } from './create-slot.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  title: string;

  description: string;

  avatar: string;

  categories: string[];

  types: string[];

  location: Record<string, string | number>;

  @ApiProperty({
    type: [CreateSlotDto],
  })
  @ValidateNested()
  @Type(() => CreateSlotDto)
  slots: CreateSlotDto[];
}
