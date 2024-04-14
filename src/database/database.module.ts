import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Activity,
  ActivityTest,
  File,
  Participant,
  Qna,
  QnaHistory,
  Role,
  Subscription,
  SubscriptionHistory,
  Test,
  TestHistory,
  User,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        database: configService.getOrThrow('DB_NAME'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASS'),
        entities: [
          Activity,
          ActivityTest,
          File,
          Participant,
          Qna,
          QnaHistory,
          Role,
          Subscription,
          SubscriptionHistory,
          Test,
          TestHistory,
          User,
        ],
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
