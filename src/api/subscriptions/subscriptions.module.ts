import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../utils/casl/casl.module';

import { Subscription } from './entities/subscription.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [TypeOrmModule.forFeature([Subscription]), CaslModule],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
