import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityTest, Qna, Test } from '../../../entities';

import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
  imports: [TypeOrmModule.forFeature([ActivityTest, Qna, Test])],
  exports: [TestsService],
})
export class TestsModule {}
