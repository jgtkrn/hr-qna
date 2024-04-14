import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { SendMailRegulerDto } from './dto/send-mail-reguler.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(sendMailRegulerDto: SendMailRegulerDto) {
    try {
      const send = await this.mailerService.sendMail(sendMailRegulerDto);
      if (send.rejected.length > 0) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
