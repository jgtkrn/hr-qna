import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { Participant } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';
import { TextGenService } from '../../utils/generator/text-gen/text-gen.service';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantsService } from './participants.service';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  const mockParticipant = new BaseEntity(Participant);

  const createParticipantDto = new CreateParticipantDto();
  createParticipantDto.name = 'test';
  createParticipantDto.email = 'email@email.email';

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockParticipant,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockParticipant,
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
        ParticipantsService,
        {
          provide: getRepositoryToken(Participant),
          useValue: repository,
        },
        {
          provide: EntityManager,
          useValue: em,
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: TextGenService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one participant', () => {
    expect(em.save(createParticipantDto)).toEqual({
      id: 'test-id',
      ...createParticipantDto,
    });
  });

  it('should return all participant', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockParticipant,
      },
    ]);
  });

  it('should return one Participant by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockParticipant,
    });
  });
});
