import { Test, TestingModule } from '@nestjs/testing';

import { TestsService } from '../tests/tests.service';
import { UsersService } from '../users/users.service';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  const mock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    assignUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        ActivitiesService,
        {
          provide: ActivitiesService,
          useValue: mock,
        },
        {
          provide: UsersService,
          useValue: mock,
        },
        {
          provide: TestsService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
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

  it('should have assignUser function', async () => {
    expect(await controller.assignUser).toBeDefined();
  });
});
