import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ParticipantsModule } from '../../api/participants/participants.module';
import { UsersModule } from '../../api/users/users.module';

import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), ParticipantsModule, UsersModule],
  providers: [CronService],
})
export class CronModule {}
