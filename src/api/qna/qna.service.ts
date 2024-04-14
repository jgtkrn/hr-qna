import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Qna, QnaHistory, Test, TestHistory } from '../../../entities';

import { CreateQnaDto } from './dto/create-qna.dto';
import { InsertAnswerDto } from './dto/insert-answer.dto';
import { UpdateQnaDto } from './dto/update-qna.dto';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(Qna)
    private readonly qnaRepository: Repository<Qna>,
    @InjectRepository(QnaHistory)
    private readonly qnaHistoryRepository: Repository<QnaHistory>,
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(TestHistory)
    private readonly testHistoryRepository: Repository<TestHistory>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createQnaDto: CreateQnaDto): Promise<Qna> {
    let result: Qna = null;
    try {
      const qna = new Qna(createQnaDto);
      result = await this.entityManager.save(qna);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<Qna[]> {
    let result: Qna[] = [];
    try {
      result = await this.qnaRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
      return result;
    } catch {
      return result;
    }
  }

  async findOne(id: number): Promise<Qna> {
    let result: Qna = null;
    try {
      result = await this.qnaRepository.findOneBy({ id });
      return result;
    } catch {
      return result;
    }
  }

  async update(qna: Qna, updateQnaDto: UpdateQnaDto): Promise<Qna> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        qna.question = updateQnaDto.question
          ? updateQnaDto.question
          : qna.question;
        qna.answers = updateQnaDto.answers ? updateQnaDto.answers : qna.answers;
        qna.key = updateQnaDto.key ? updateQnaDto.key : qna.key;
        qna.type = updateQnaDto.type ? updateQnaDto.type : qna.type;
        qna.isActive = updateQnaDto.isActive
          ? updateQnaDto.isActive
          : qna.isActive;
        await entityManager.save(qna);
      });
      return this.qnaRepository.findOneBy({ id: qna.id });
    } catch {
      return null;
    }
  }

  async remove(qna: Qna) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        qna.isActive = false;
        qna.deletedAt = new Date();
        await entityManager.save(qna);
      });
      return this.qnaRepository.findOneBy({ id: qna.id });
    } catch {
      return null;
    }
  }

  async findByTestId(testId: number): Promise<Qna[]> {
    let result: Qna[] = [];
    try {
      result = await this.qnaRepository.find({
        where: {
          testId,
          isActive: true,
          deletedAt: null,
        },
        select: {
          id: true,
          question: true,
          answers: true,
          type: true,
          testId: true,
        },
      });
      return result;
    } catch {
      return result;
    }
  }

  async insertMany(payload: CreateQnaDto[]): Promise<Qna[]> {
    let results: Qna[] = [];
    const qnas: Qna[] = [];
    try {
      for (let i = 0; i < payload.length; i++) {
        const data = new Qna(payload[i]);
        qnas.push(data);
      }
      if (qnas.length > 0) {
        results = await this.entityManager.save(qnas);
      }
      return results;
    } catch (error) {
      return results;
    }
  }

  async insertHistoryAnswer(
    payload: InsertAnswerDto,
    participantId: number,
    activityId: number,
  ): Promise<any> {
    let results: any = null;
    const baseHistory: any = {
      participantId,
      activityId,
      testId: payload.testId,
      type: payload.type,
      sendType: payload.sendType,
    };
    const qnaHistory: any = {
      ...baseHistory,
      qnaId: payload.qnaId,
      answer: payload.answer,
    };
    const testHistory: any = { ...baseHistory };
    try {
      const qna = await this.qnaRepository.findOneBy({ id: payload.qnaId });
      const isCorrect = qna.key === payload.answer ? true : false;
      qnaHistory.isCorrect = isCorrect;
      qnaHistory.key = qna.key ? qna.key : null;
      const insertQnaHistory = await this.insertQnaHistory(qnaHistory);

      testHistory.isCorrect = isCorrect;
      testHistory.isUpdate = insertQnaHistory.isUpdate;
      const insertTestHistory = await this.insertTestHistory(testHistory);
      if (insertTestHistory) results = insertQnaHistory;
      return results;
    } catch (error) {
      return results;
    }
  }

  async insertTestHistory(payload: any): Promise<any> {
    let result: any = null;
    try {
      const isCorrect = payload.isCorrect;
      const isUpdate = payload.isUpdate;
      const sendType = payload.sendType;
      delete payload.sendType;
      delete payload.isCorrect;
      delete payload.isUpdate;

      let testHistory = await this.testHistoryRepository.findOneBy({
        participantId: payload.participantId,
        activityId: payload.activityId,
        testId: payload.testId,
      });
      if (!testHistory) {
        const qna = await this.qnaRepository.find({
          where: {
            testId: Number(payload.testId),
          },
          select: {
            id: true,
          },
        });

        const count = qna.length;
        let test: any = await this.testRepository.find({
          where: {
            id: Number(payload.testId),
          },
          select: {
            id: true,
            duration: true,
          },
        });
        test = test.length === 0 ? null : test[0];

        testHistory = new TestHistory(payload);
        testHistory.startTime = new Date();
        testHistory.endTime = new Date();
        testHistory.questionAnswered = 1;
        testHistory.questionNotAnswered = count - 1;
        testHistory.answerCorrect = isCorrect ? 1 : 0;
        testHistory.answerIncorrect = isCorrect ? count - 1 : count;
        testHistory.duration =
          test && test.duration ? Number(test.duration) : 0;
        testHistory.type = payload.type;
        testHistory.isActive = true;
        testHistory.status = 'IN_PROGRESS';
      } else {
        testHistory.questionAnswered = isUpdate
          ? testHistory.questionAnswered
          : testHistory.questionAnswered + 1;
        testHistory.questionNotAnswered = isUpdate
          ? testHistory.questionNotAnswered
          : testHistory.questionNotAnswered - 1;
        testHistory.answerCorrect = isCorrect
          ? testHistory.answerCorrect + 1
          : testHistory.answerCorrect;
        testHistory.answerIncorrect = isCorrect
          ? testHistory.answerIncorrect - 1
          : testHistory.answerIncorrect;
        const startTime = new Date(testHistory.startTime);
        const checkTime = startTime.setMinutes(
          startTime.getMinutes() + testHistory.duration,
        );
        if (new Date(checkTime) > new Date()) {
          testHistory.status =
            sendType === 'ANSWER' ? 'IN_PROGRESS' : 'FINISHED';
          testHistory.endTime = new Date();
        } else {
          testHistory.status = 'FINISHED';
          testHistory.endTime = new Date(checkTime);
        }
      }
      testHistory.percentage =
        (testHistory.answerCorrect /
          (testHistory.answerCorrect + testHistory.answerIncorrect)) *
        100;
      result = await this.entityManager.save(testHistory);
      return result;
    } catch (error) {
      return result;
    }
  }

  async insertQnaHistory(payload: any): Promise<any> {
    let result: any = null;
    try {
      delete payload.sendType;
      let isUpdate = false;
      let qnaHistory = await this.qnaHistoryRepository.findOneBy({
        qnaId: payload.qnaId,
        participantId: payload.participantId,
      });
      if (qnaHistory) {
        qnaHistory.answer = payload.answer;
        qnaHistory.isCorrect = payload.isCorrect;
        isUpdate = true;
      } else {
        qnaHistory = new QnaHistory(payload);
      }
      result = await this.entityManager.save(qnaHistory);
      result.isUpdate = isUpdate;
      return result;
    } catch (error) {
      return result;
    }
  }
}
