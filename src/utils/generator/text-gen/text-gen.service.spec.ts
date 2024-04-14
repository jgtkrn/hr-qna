import { Test, TestingModule } from '@nestjs/testing';

import { TextGenService } from './text-gen.service';

describe('TextGenService', () => {
  let service: TextGenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextGenService],
    }).compile();

    service = module.get<TextGenService>(TextGenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
