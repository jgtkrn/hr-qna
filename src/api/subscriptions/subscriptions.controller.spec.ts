import { Test, TestingModule } from '@nestjs/testing';

import { CaslAbilityFactory } from '../../utils/casl/casl-ability-factory';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  const mock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        SubscriptionsService,
        {
          provide: SubscriptionsService,
          useValue: mock,
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            can: jest.fn(),
            cannot: jest.fn(),
            build: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should have create function', async () => {
    expect(await controller.create).toBeDefined();
  });

  it('should have findAll function', async () => {
    expect(await controller.findAll).toBeDefined();
  });

  it('should have findOne function', async () => {
    expect(await controller.findOne).toBeDefined();
  });

  it('should have update function', async () => {
    expect(await controller.update).toBeDefined();
  });

  it('should have remove function', async () => {
    expect(await controller.remove).toBeDefined();
  });
});
