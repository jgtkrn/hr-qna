import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseResponse } from '../../abstracts/base-response';

import { SendMailRegulerDto } from './dto/send-mail-reguler.dto';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({ summary: 'Send Email' })
  @ApiResponse({ status: 201, description: 'Success Send Email.' })
  @ApiResponse({ status: 400, description: 'Failed Send Email.' })
  async sendMail(
    @Body() sendMailRegulerDto: SendMailRegulerDto,
    @Res() response,
  ) {
    const ctx = `Send Mail to ${sendMailRegulerDto.to}`;
    const sent = await this.mailService.sendMail(sendMailRegulerDto);
    if (!sent) {
      response
        .status(400)
        .send(new BaseResponse(null, `Failed ${ctx}`, 400, false));
    }
    response
      .status(200)
      .send(new BaseResponse(null, `Success ${ctx}`, 200, true));
  }
}
