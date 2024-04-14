import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity, Participant, TestHistory } from '../../../entities';
import { MailModule } from '../../helper/mail/mail.module';
import { TextGenModule } from '../../utils/generator/text-gen/text-gen.module';
import { ActivitiesModule } from '../activities/activities.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  imports: [
    TypeOrmModule.forFeature([Activity, Participant, TestHistory]),
    TextGenModule,
    MailModule,
    SubscriptionsModule,
    forwardRef(() => ActivitiesModule),
  ],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
