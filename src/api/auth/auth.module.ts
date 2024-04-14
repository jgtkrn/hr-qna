import { Module } from '@nestjs/common';

import { ParticipantsModule } from '../participants/participants.module';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ParticipantsModule, UsersModule],
})
export class AuthModule {}
