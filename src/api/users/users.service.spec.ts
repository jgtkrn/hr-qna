import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { User } from '../../../entities';
import { BaseEntity } from '../../abstracts/base-entity';
import { MailService } from '../../helper/mail/mail.service';
import { TextGenService } from '../../utils/generator/text-gen/text-gen.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = new BaseEntity(User);

  const createUserDto = new CreateUserDto();
  createUserDto.name = 'test';
  createUserDto.email = 'email@email.email';

  const repository = {
    find: jest.fn(() => {
      return [
        {
          id: 'test-id',
          ...mockUser,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...mockUser,
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
        UsersService,
        MailService,
        TextGenService,
        {
          provide: getRepositoryToken(User),
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
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert one user', () => {
    expect(em.save(createUserDto)).toEqual({
      id: 'test-id',
      ...createUserDto,
    });
  });

  it('should return all user', () => {
    expect(repository.find()).toEqual([
      {
        id: 'test-id',
        ...mockUser,
      },
    ]);
  });

  it('should return one user by given id', () => {
    expect(repository.findOne('test-id')).toEqual({
      id: 'test-id',
      ...mockUser,
    });
  });
});
