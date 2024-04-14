import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Qna, QnaHistory, Test, TestHistory } from '../../../entities';

import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';

@Module({
  controllers: [QnaController],
  providers: [QnaService],
  imports: [TypeOrmModule.forFeature([Qna, QnaHistory, Test, TestHistory])],
  exports: [QnaService],
})
export class QnaModule {}
