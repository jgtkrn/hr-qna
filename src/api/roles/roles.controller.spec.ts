import { Test, TestingModule } from '@nestjs/testing';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;

  const mock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: RolesService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
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
