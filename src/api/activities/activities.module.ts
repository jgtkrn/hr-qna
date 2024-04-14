import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Activity,
  ActivityTest,
  Participant,
  Test,
  User,
} from '../../../entities';
import { ParticipantsModule } from '../participants/participants.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TestsModule } from '../tests/tests.module';
import { UsersModule } from '../users/users.module';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [
    TypeOrmModule.forFeature([Activity, ActivityTest, Participant, Test, User]),
    ParticipantsModule,
    SubscriptionsModule,
    TestsModule,
    UsersModule,
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
