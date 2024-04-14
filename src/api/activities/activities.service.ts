import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import {
  Activity,
  ActivityTest,
  Participant,
  Test,
  User,
} from '../../../entities';

import { CreateActivityDto } from './dto/create-activity.dto';
import { ReOrderTestsDto } from './dto/reorder-tests.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectRepository(ActivityTest)
    private readonly activityTestsRepository: Repository<ActivityTest>,
    @InjectRepository(Participant)
    private readonly participantsRepository: Repository<Participant>,
    @InjectRepository(Test)
    private readonly testsRepository: Repository<Test>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    let result: Activity = null;
    try {
      const activity = new Activity(createActivityDto);
      result = await this.entityManager.save(activity);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<any[]> {
    let result: any[] = [];
    try {
      const participantCount = await this.getActiveParticipantSet();
      const testCount = await this.getActiveTestSet();

      result = await this.activitiesRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
      if (result.length === 0) {
        return result;
      }
      for (let i = 0; i < result.length; i++) {
        if (new Date() > new Date(result[i].endTime)) {
          result[i].status = 'FINISHED';
        } else {
          result[i].status = 'ON GOING';
        }
        result[i].testCount = testCount[result[i].id]
          ? testCount[result[i].id]
          : 0;
        result[i].participantCount = participantCount[result[i].id]
          ? participantCount[result[i].id]
          : 0;
      }
      return result;
    } catch {
      return result;
    }
  }

  async findOne(id: number): Promise<Activity> {
    let result: Activity = null;
    try {
      result = await this.activitiesRepository.findOneBy({ id });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async findSummary(id: number): Promise<any> {
    let result: any = null;
    try {
      result = await this.activitiesRepository.find({
        where: {
          id,
          isActive: true,
          deletedAt: null,
        },
      });
      if (result.length === 0) {
        return null;
      }
      result = result[0];

      const participants = await this.participantsRepository.find({
        where: {
          activityId: result.id,
        },
        select: {
          id: true,
          activityId: true,
        },
      });

      const testIds: number[] = [];
      const activityTests = await this.activityTestsRepository.find({
        where: { activityId: result.id },
        select: {
          testId: true,
        },
      });
      for (let i = 0; i < activityTests.length; i++) {
        testIds.push(activityTests[i].testId);
      }
      const tests = await this.testsRepository.find({
        where: {
          id: In(testIds),
        },
      });
      result.participantCount = participants.length;
      result.tests = [];
      if (tests && tests.length !== 0) {
        result.tests = tests;
      }
      return result;
    } catch {
      return null;
    }
  }

  async findOneWithComponents(id: number): Promise<Activity> {
    let result: Activity = null;
    try {
      result = await this.activitiesRepository.findOne({
        where: { id },
        relations: ['activityTests.test', 'participants'],
      });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async update(
    activity: Activity,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        activity.name = updateActivityDto.name
          ? updateActivityDto.name
          : activity.name;
        activity.isActive = updateActivityDto.isActive
          ? updateActivityDto.isActive
          : activity.isActive;
        activity.startTime = updateActivityDto.startTime
          ? updateActivityDto.startTime
          : activity.startTime;
        activity.endTime = updateActivityDto.endTime
          ? updateActivityDto.endTime
          : activity.endTime;
        activity.description = updateActivityDto.description
          ? updateActivityDto.description
          : activity.description;
        activity.tokenPerUser = updateActivityDto.tokenPerUser
          ? updateActivityDto.tokenPerUser
          : activity.tokenPerUser;
        activity.tokenMax = updateActivityDto.tokenMax
          ? updateActivityDto.tokenMax
          : activity.tokenMax;
        activity.status = updateActivityDto.status
          ? updateActivityDto.status
          : activity.status;
        activity.isProctoring = updateActivityDto.isProctoring
          ? updateActivityDto.isProctoring
          : activity.isProctoring;
        activity.createdBy = updateActivityDto.createdBy
          ? updateActivityDto.createdBy
          : activity.createdBy;
        activity.updatedBy = updateActivityDto.updatedBy
          ? updateActivityDto.updatedBy
          : activity.updatedBy;
        await entityManager.save(activity);
      });
      return this.activitiesRepository.findOneBy({ id: activity.id });
    } catch {
      return null;
    }
  }

  async remove(activity: Activity): Promise<Activity> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        activity.isActive = false;
        activity.deletedAt = new Date();
        await entityManager.save(activity);
      });
      return this.activitiesRepository.findOneBy({ id: activity.id });
    } catch {
      return null;
    }
  }

  async assignUser(user: User, activity: Activity): Promise<Activity> {
    try {
      let result = await this.activitiesRepository.findOne({
        where: {
          id: activity.id,
        },
        relations: ['users'],
      });
      await this.entityManager.transaction(async (entityManager) => {
        result.users.push(user);
        await entityManager.save(result);
      });
      result = await this.activitiesRepository.findOne({
        where: {
          id: activity.id,
        },
        relations: ['users'],
      });
      return result;
    } catch {
      return null;
    }
  }

  async assignTests(
    activity: Activity,
    activityTests: any[],
    testIds: number[],
  ): Promise<ActivityTest[]> {
    try {
      let tokenAdd: number = 0;
      const tokenPerUser = activity.tokenPerUser ? activity.tokenPerUser : 0;
      for (let i = 0; i < activityTests.length; i++) {
        const check = await this.activityTestsRepository.findOne({
          where: {
            activityId: activityTests[i].activityId,
            testId: activityTests[i].testId,
          },
        });
        if (!check) {
          tokenAdd += activityTests[i].testToken;
          delete activityTests[i].testToken;
          await this.activityTestsRepository.insert(activityTests[i]);
        } else if (check) {
          delete activityTests[i].testToken;
          await this.activityTestsRepository.update(
            {
              activityId: activityTests[i].activityId,
              testId: activityTests[i].testId,
            },
            activityTests[i],
          );
        }
      }

      activity.tokenPerUser = tokenPerUser + tokenAdd;
      await this.entityManager.save(activity);

      const result = await this.activityTestsRepository.find({
        where: {
          activityId: activityTests[0].activityId,
          testId: In([...testIds]),
        },
      });
      return result;
    } catch {
      return null;
    }
  }

  async findTestsByActivity(activity: Activity): Promise<ActivityTest[]> {
    try {
      const result = await this.activityTestsRepository.find({
        where: {
          activityId: activity.id,
        },
        relations: ['test'],
        order: {
          order: 'ASC',
        },
      });
      return result;
    } catch {
      return null;
    }
  }

  async reOrderTests(payload: ReOrderTestsDto): Promise<ActivityTest[]> {
    try {
      const orders = payload.orders;
      for (let i = 0; i < orders.length; i++) {
        const check = await this.activityTestsRepository.findOne({
          where: {
            activityId: orders[i].activityId,
            testId: orders[i].testId,
          },
        });
        if (!check) {
          await this.activityTestsRepository.insert(orders[i]);
        } else if (check) {
          await this.activityTestsRepository.update(
            {
              activityId: orders[i].activityId,
              testId: orders[i].testId,
            },
            orders[i],
          );
        }
      }
      const result = await this.activityTestsRepository.find({
        where: {
          activityId: orders[0].activityId,
        },
        relations: ['test'],
        order: {
          order: 'ASC',
        },
      });
      return result;
    } catch {
      return null;
    }
  }

  async testListPopUp(activity: Activity): Promise<any[]> {
    try {
      const tests = await this.activityTestsRepository.find({
        where: {
          activityId: activity.id,
        },
        relations: ['test'],
        order: {
          order: 'ASC',
        },
        select: {
          id: true,
          test: {
            id: true,
            name: true,
          },
        },
      });
      if (!tests) {
        return [];
      }
      const results = [];
      for (let i = 0; i < tests.length; i++) {
        const exam = tests[i].test;
        if (exam && exam.name) {
          results.push({
            id: exam.id,
            name: exam.name,
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  }
  async participantListPopUp(id: number): Promise<any[]> {
    try {
      const activity = await this.activitiesRepository.find({
        where: {
          id,
          isActive: true,
        },
        relations: ['participants'],
        select: {
          id: true,
          participants: {
            id: true,
            email: true,
            emailSent: true,
          },
        },
      });

      if (!activity[0]) {
        return [];
      }
      const results = [];
      for (let i = 0; i < activity[0].participants.length; i++) {
        const participant = activity[0].participants[i];
        if (participant && participant.email) {
          results.push({
            id: participant.id,
            email: participant.email,
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  }

  async activeActivitiesId(): Promise<any> {
    try {
      const activities = await this.activitiesRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });
      if (activities.length === 0) {
        return [];
      }
      const results = [];
      for (let i = 0; i < activities.length; i++) {
        results.push(activities[i].id);
      }
      return results;
    } catch {
      return [];
    }
  }

  async getActiveParticipantSet(): Promise<any> {
    try {
      const activities = await this.activeActivitiesId();
      if (activities.length === 0) {
        return null;
      }
      const participants = await this.participantsRepository.find({
        where: {
          activityId: In(activities),
        },
        select: {
          id: true,
          activityId: true,
        },
      });
      const result: any = {};
      for (let i = 0; i < participants.length; i++) {
        if (!result[`${participants[i].activityId}`]) {
          result[`${participants[i].activityId}`] = 1;
        } else {
          result[`${participants[i].activityId}`] += 1;
        }
      }
      return result;
    } catch {
      return null;
    }
  }

  async getActiveTestSet(): Promise<any> {
    try {
      const activities = await this.activeActivitiesId();
      if (activities.length === 0) {
        return null;
      }
      const activityTests = await this.activityTestsRepository.find({
        where: {
          activityId: In(activities),
        },
        select: {
          id: true,
          activityId: true,
        },
      });
      const result: any = {};
      for (let i = 0; i < activityTests.length; i++) {
        if (!result[`${activityTests[i].activityId}`]) {
          result[`${activityTests[i].activityId}`] = 1;
        } else {
          result[`${activityTests[i].activityId}`] += 1;
        }
      }
      return result;
    } catch {
      return null;
    }
  }
}
