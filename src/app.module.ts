import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ActivitiesModule } from './api/activities/activities.module';
import { AuthModule } from './api/auth/auth.module';
import { ParticipantsModule } from './api/participants/participants.module';
import { QnaModule } from './api/qna/qna.module';
import { RolesModule } from './api/roles/roles.module';
import { SubscriptionHistoryModule } from './api/subscription-history/subscription-history.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';
import { TestsModule } from './api/tests/tests.module';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './helper/file/file.module';
import { MailModule } from './helper/mail/mail.module';
import { VerifyTokenMiddleware } from './middleware/verify-token/verify-token.middleware';
import { CaslModule } from './utils/casl/casl.module';
import { CronModule } from './utils/cron/cron.module';
import { TextGenModule } from './utils/generator/text-gen/text-gen.module';
import { GlobalJwtModule } from './utils/global-jwt/global-jwt.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/v1/public',
    }),
    DatabaseModule,
    RolesModule,
    UsersModule,
    ActivitiesModule,
    SubscriptionsModule,
    AuthModule,
    MailModule,
    GlobalJwtModule,
    CaslModule,
    TestsModule,
    QnaModule,
    ParticipantsModule,
    CronModule,
    TextGenModule,
    SubscriptionHistoryModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'doc', method: RequestMethod.ALL },
        { path: 'doc-json', method: RequestMethod.ALL },
        { path: 'public', method: RequestMethod.GET },
        { path: 'public/(.*)', method: RequestMethod.GET },
        { path: 'ping', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
