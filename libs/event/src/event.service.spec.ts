import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Event } from '@app/event/schema/event.schema';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';

describe('EventService', () => {
  let service: EventService;
  let eventModel: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: {
            paginate: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventModel = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should call paginate with correct parameters', () => {
      const page = 1;
      const limit = 10;
      const expectedQuery = {};
      const expectedOptions = {
        page,
        limit,
        select: '-slots',
      };

      service.get({ page, limit });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(eventModel.paginate).toHaveBeenCalledWith(
        expectedQuery,
        expectedOptions,
      );
    });
  });

  describe('getFeatured', () => {
    it('should call paginate with correct parameters', () => {
      const page = 1;
      const limit = 10;
      const expectedQuery = {};
      const expectedOptions = {
        page,
        limit,
      };

      service.getFeatured({ page, limit });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(eventModel.paginate).toHaveBeenCalledWith(
        expectedQuery,
        expectedOptions,
      );
    });
  });

  describe('getUpcoming', () => {
    it('should call paginate with correct parameters', () => {
      const page = 1;
      const limit = 10;
      const expectedQuery = {};
      const expectedOptions = {
        page,
        limit,
      };

      service.getUpcoming({ page, limit });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(eventModel.paginate).toHaveBeenCalledWith(
        expectedQuery,
        expectedOptions,
      );
    });
  });

  describe('getLatest', () => {
    it('should call paginate with correct parameters', () => {
      const page = 1;
      const limit = 10;
      const expectedQuery = {};
      const expectedOptions = {
        page,
        limit,
      };

      service.getLatest({ page, limit });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(eventModel.paginate).toHaveBeenCalledWith(
        expectedQuery,
        expectedOptions,
      );
    });
  });

  describe('getById', () => {
    it('should call findById with correct eventId', () => {
      const eventId = 'eventId';

      service.getById(eventId);

      expect(eventModel.findById).toHaveBeenCalledWith(eventId);
    });
  });

  describe('create', () => {
    it('should call create with correct event data', () => {
      const eventData = { name: 'Test Event', date: new Date() };

      service.create(eventData);

      expect(eventModel.create).toHaveBeenCalledWith(eventData);
    });
  });
});
