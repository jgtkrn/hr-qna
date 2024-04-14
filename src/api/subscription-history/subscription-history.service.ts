import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { SubscriptionHistory } from '../../../entities';

import { CreateSubscriptionHistoryDto } from './dto/create-subscription-history.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UpdateSubscriptionHistoryDto } from './dto/update-subscription-history.dto';

@Injectable()
export class SubscriptionHistoryService {
  constructor(
    @InjectRepository(SubscriptionHistory)
    private readonly subscriptionHistoryRepository: Repository<SubscriptionHistory>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(
    createSubscriptionHistoryDto: CreateSubscriptionHistoryDto,
  ): Promise<SubscriptionHistory> {
    let result: SubscriptionHistory = null;
    try {
      const subscriptionHistory = new SubscriptionHistory(
        createSubscriptionHistoryDto,
      );
      result = await this.entityManager.save(subscriptionHistory);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<SubscriptionHistory[]> {
    let result: SubscriptionHistory[] = [];
    try {
      result = await this.subscriptionHistoryRepository.find({
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

  async findAllByUser(user: any): Promise<SubscriptionHistory[]> {
    let result: SubscriptionHistory[] = [];
    try {
      result = await this.subscriptionHistoryRepository.find({
        where: {
          userId: user.id,
          isActive: true,
          deletedAt: null,
        },
      });
      return result;
    } catch {
      return result;
    }
  }

  async findOne(id: number): Promise<SubscriptionHistory> {
    let result: SubscriptionHistory = null;
    try {
      result = await this.subscriptionHistoryRepository.findOneBy({ id });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async update(
    subscriptionHistory: SubscriptionHistory,
    updateSubscriptionHistoryDto: any,
  ): Promise<SubscriptionHistory> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        subscriptionHistory.amount = updateSubscriptionHistoryDto.amount
          ? updateSubscriptionHistoryDto.amount
          : subscriptionHistory.amount;
        subscriptionHistory.status = updateSubscriptionHistoryDto.status
          ? updateSubscriptionHistoryDto.status
          : subscriptionHistory.status;
        subscriptionHistory.isActive = updateSubscriptionHistoryDto.isActive
          ? updateSubscriptionHistoryDto.isActive
          : subscriptionHistory.isActive;
        await entityManager.save(subscriptionHistory);
      });
      return this.subscriptionHistoryRepository.findOneBy({
        id: subscriptionHistory.id,
      });
    } catch {
      return null;
    }
  }

  async remove(
    subscriptionHistory: SubscriptionHistory,
  ): Promise<SubscriptionHistory> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        subscriptionHistory.isActive = false;
        subscriptionHistory.deletedAt = new Date();
        await entityManager.save(subscriptionHistory);
      });
      return this.subscriptionHistoryRepository.findOneBy({
        id: subscriptionHistory.id,
      });
    } catch {
      return null;
    }
  }
}
