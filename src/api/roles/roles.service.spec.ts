import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Role } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;

  const mockRole = new BaseEntity(Role);

  const createRoleDto = new CreateRoleDto();
  createRoleDto.name = 'test';
  createRoleDto.isActive = false;

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockRole,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockRole,
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
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: repository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one role', () => {
    expect(em.save(createRoleDto)).toEqual({
      id: 'test-id',
      ...createRoleDto,
    });
  });

  it('should return all role', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockRole,
      },
    ]);
  });

  it('should return one role by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockRole,
    });
  });
});
