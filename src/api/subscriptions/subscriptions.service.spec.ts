import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Subscription } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  const mockSubscription = new BaseEntity(Subscription);

  const createSubscriptionDto = new CreateSubscriptionDto();
  createSubscriptionDto.amount = 1000;
  createSubscriptionDto.isActive = false;

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockSubscription,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockSubscription,
      };
    }),
  };

  const em = {
    save: jest.fn((dto) => {
      return {
        id: 'test-id',
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: repository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one subscription', () => {
    expect(em.save(createSubscriptionDto)).toEqual({
      id: 'test-id',
      ...createSubscriptionDto,
    });
  });

  it('should return all subscription', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockSubscription,
      },
    ]);
  });

  it('should return one subscription by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockSubscription,
    });
  });
});
