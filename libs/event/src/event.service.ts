import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@app/event/schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  public get({ page, limit }) {
    return (
      this.eventModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .paginate(
          {},
          {
            page,
            limit,
            select: '-slots',
          },
        )
    );
  }

  public getFeatured({ page, limit }) {
    return (
      this.eventModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .paginate(
          {},
          {
            page,
            limit,
          },
        )
    );
  }

  public getUpcoming({ page, limit }) {
    return (
      this.eventModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .paginate(
          {},
          {
            page,
            limit,
          },
        )
    );
  }

  public getLatest({ page, limit }) {
    return (
      this.eventModel
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .paginate(
          {},
          {
            page,
            limit,
          },
        )
    );
  }

  public getById(eventId: string) {
    return this.eventModel.findById(eventId);
  }

  public create(event: object) {
    return this.eventModel.create(event);
  }
}
