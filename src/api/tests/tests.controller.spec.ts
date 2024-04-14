import { Test, TestingModule } from '@nestjs/testing';

import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

describe('TestsController', () => {
  let controller: TestsController;

  const mock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [
        TestsService,
        {
          provide: TestsService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<TestsController>(TestsController);
  });

  it('should be defined', async () => {
    expect(await controller).toBeDefined();
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
