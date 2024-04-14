import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Activity, ActivityTest, Test as Exam } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';

import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  const mockActivity = new BaseEntity(Activity);
  const mockActivityTest = new BaseEntity(ActivityTest);
  const mockExam = new BaseEntity(Exam);

  const createActivityDto = new CreateActivityDto();
  createActivityDto.name = 'test';
  createActivityDto.isActive = false;

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockActivity,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockActivity,
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

  const examRepository = {
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
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(ActivityTest),
          useValue: actExamRepository,
        },
        {
          provide: getRepositoryToken(Exam),
          useValue: examRepository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one activity', () => {
    expect(em.save(createActivityDto)).toEqual({
      id: 'test-id',
      ...createActivityDto,
    });
  });

  it('should return all activity', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockActivity,
      },
    ]);
  });

  it('should return one activity by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockActivity,
    });
  });
});
