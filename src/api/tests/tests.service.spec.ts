import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { ActivityTest, Test as Exam } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';

import { CreateTestDto } from './dto/create-test.dto';
import { TestsService } from './tests.service';

describe('TestsService', () => {
  let service: TestsService;
  const mockExam = new BaseEntity(Exam);
  const mockActivityTest = new BaseEntity(ActivityTest);

  const createTestDto = new CreateTestDto();
  createTestDto.name = 'test';
  createTestDto.isActive = false;

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockExam,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockExam,
      };
    }),
  };

  const actExamRepository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockActivityTest,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockActivityTest,
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
        TestsService,
        {
          provide: getRepositoryToken(Exam),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(ActivityTest),
          useValue: actExamRepository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<TestsService>(TestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one test', () => {
    expect(em.save(createTestDto)).toEqual({
      id: 'test-id',
      ...createTestDto,
    });
  });

  it('should return all test', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockExam,
      },
    ]);
  });

  it('should return one test by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockExam,
    });
  });
});
