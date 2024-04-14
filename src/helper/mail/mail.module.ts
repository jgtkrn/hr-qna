import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('MAIL_HOST'),
          port: configService.getOrThrow('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.getOrThrow('MAIL_USER'),
            pass: configService.getOrThrow('MAIL_PASS'),
          },
        },
        defaults: {
          from: configService.getOrThrow('MAIL_USER'),
        },
      }),
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
