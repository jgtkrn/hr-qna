import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Qna } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';

import { CreateQnaDto } from './dto/create-qna.dto';
import { QnaService } from './qna.service';

describe('QnaService', () => {
  let service: QnaService;

  const mockQna = new BaseEntity(Qna);

  const createQnaDto = new CreateQnaDto();
  createQnaDto.question = 'test';
  createQnaDto.isActive = false;

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockQna,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockQna,
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
        QnaService,
        {
          provide: getRepositoryToken(Qna),
          useValue: repository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    service = module.get<QnaService>(QnaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one qna', () => {
    expect(em.save(createQnaDto)).toEqual({
      id: 'test-id',
      ...createQnaDto,
    });
  });

  it('should return all qna', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockQna,
      },
    ]);
  });

  it('should return one qna by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockQna,
    });
  });
});
