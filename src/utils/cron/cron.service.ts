import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UpdateParticipantDto } from '../../api/participants/dto/update-participant.dto';
import { ParticipantsService } from '../../api/participants/participants.service';
import { CreateUserDto } from '../../api/users/dto/create-user.dto';
import { UsersService } from '../../api/users/users.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly usersService: UsersService,
  ) {}

  @Cron('*/15 * * * * *')
  async inviteParticipant() {
    const payload = new UpdateParticipantDto();
    const sending = await this.participantsService.inviteOne(payload);
    if (sending) {
      this.logger.debug(
        `${ParticipantsService.name}: Success Sending Invitation to ${sending.email}.`,
      );
    } else {
      this.logger.debug(`${ParticipantsService.name}: No Invitation Sent.`);
    }
  }

  @Cron('*/17 * * * * *')
  async inviteUser() {
    const payload = new CreateUserDto();
    const sending = await this.usersService.inviteOne(payload);
    if (sending) {
      this.logger.debug(
        `${UsersService.name}: Success Sending Invitation to ${sending.email}.`,
      );
    } else {
      this.logger.debug(`${UsersService.name}: No Invitation Sent.`);
    }
  }

  @Cron('*/19 * * * * *')
  async updateEndedTest() {
    const updateHistory = await this.participantsService.updateEndedTest();
    if (updateHistory) {
      this.logger.debug(
        `${ParticipantsService.name}: Success Update Ended Activity.`,
      );
    } else {
      this.logger.debug(
        `${ParticipantsService.name}: Failed Update Ended Activity.`,
      );
    }
  }

  // @Cron('*/19 * * * * *')
  // async inviteParticipantFailed() {
  //   const payload = new UpdateParticipantDto();
  //   const sending = await this.participantsService.inviteOneFailed(payload);
  //   if (sending) {
  //     this.logger.debug(
  //       `${ParticipantsService.name}: Success Re-Sending Invitation to ${sending.email}.`,
  //     );
  //   } else {
  //     this.logger.debug(`${ParticipantsService.name}: No Invitation Re-Sent.`);
  //   }
  // }
}
