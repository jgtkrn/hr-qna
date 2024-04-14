import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Subscription } from '../../../entities';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    let result: Subscription = null;
    try {
      const subscription = new Subscription(createSubscriptionDto);
      result = await this.entityManager.save(subscription);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<Subscription[]> {
    let result: Subscription[] = [];
    try {
      result = await this.subscriptionsRepository.find({
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

  async findOne(id: number): Promise<Subscription> {
    let result: Subscription = null;
    try {
      result = await this.subscriptionsRepository.findOneBy({ id });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async findOneByUser(userId: number): Promise<Subscription> {
    let result: Subscription = null;
    try {
      result = await this.subscriptionsRepository.findOneBy({ userId });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async update(
    subscription: Subscription,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        subscription.amount = updateSubscriptionDto.amount
          ? updateSubscriptionDto.amount
          : subscription.amount;
        subscription.isActive = updateSubscriptionDto.isActive
          ? updateSubscriptionDto.isActive
          : subscription.isActive;
        await entityManager.save(subscription);
      });
      return this.subscriptionsRepository.findOneBy({ id: subscription.id });
    } catch {
      return null;
    }
  }

  async remove(subscription: Subscription): Promise<Subscription> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        subscription.isActive = false;
        subscription.deletedAt = new Date();
        await entityManager.save(subscription);
      });
      return this.subscriptionsRepository.findOneBy({ id: subscription.id });
    } catch {
      return null;
    }
  }
}
