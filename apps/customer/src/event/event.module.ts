import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventModule as CoreEventModule } from '@app/event';

@Module({
  imports: [CoreEventModule],
  controllers: [EventController],
})
export class EventModule {}
