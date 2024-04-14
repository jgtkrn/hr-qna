import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../utils/casl/casl.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { SubscriptionHistory } from './entities/subscription-history.entity';
import { SubscriptionHistoryController } from './subscription-history.controller';
import { SubscriptionHistoryService } from './subscription-history.service';

@Module({
  controllers: [SubscriptionHistoryController],
  providers: [SubscriptionHistoryService],
  imports: [
    TypeOrmModule.forFeature([SubscriptionHistory]),
    CaslModule,
    SubscriptionsModule,
  ],
})
export class SubscriptionHistoryModule {}
