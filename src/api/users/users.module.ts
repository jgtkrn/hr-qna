import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../../helper/mail/mail.module';
import { TextGenModule } from '../../utils/generator/text-gen/text-gen.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), TextGenModule, MailModule],
  exports: [UsersService],
})
export class UsersModule {}
