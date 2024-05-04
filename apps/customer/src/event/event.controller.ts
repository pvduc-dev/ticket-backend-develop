import { EventService } from '@app/event';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseMongoIdPipe } from './pipe/parse-mongo-id.pipe';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('/events')
@ApiTags('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiQuery({
    allowReserved: false,
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async get(
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
    @Query(
      'limit',
      new DefaultValuePipe(12),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ) {
    return this.eventService.get({ page, limit });
  }

  @Get('/featured')
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Full text search',
  })
  @ApiQuery({
    allowReserved: false,
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async getFeatured(
    @Query('q') search?: string,
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
    @Query(
      'limit',
      new DefaultValuePipe(12),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ) {
    return this.eventService.get({ page, limit });
  }

  @Get('/upcoming')
  @ApiQuery({
    allowReserved: false,
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async getUpComing(
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
    @Query(
      'limit',
      new DefaultValuePipe(12),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ) {
    return this.eventService.get({ page, limit });
  }

  @Get('/latest')
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Full text search',
  })
  @ApiQuery({
    allowReserved: false,
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async getLatest(
    @Query('q') search?: string,
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
    @Query(
      'limit',
      new DefaultValuePipe(12),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ) {
    return this.eventService.get({ page, limit });
  }

  @Get('/:id')
  @ApiNotFoundResponse({
    description: 'No event found',
  })
  async getById(@Param('id', ParseMongoIdPipe) eventId: string) {
    const event = await this.eventService.getById(eventId);
    if (!event) {
      throw new NotFoundException('No event found');
    }
    return event;
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create({
      ...createEventDto,
      slots: createEventDto.slots,
    });
  }
}
