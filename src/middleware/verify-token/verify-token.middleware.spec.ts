import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../../api/users/users.service';

import { VerifyTokenMiddleware } from './verify-token.middleware';
describe('VerifyTokenMiddleware', () => {
  let middleware: VerifyTokenMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyTokenMiddleware,
        {
          provide: VerifyTokenMiddleware,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    middleware = module.get<VerifyTokenMiddleware>(VerifyTokenMiddleware);
  });
  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
