import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
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
} from './entities';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  database: configService.getOrThrow('DB_NAME'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  migrations: ['migrations/**'],
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
});